package middleware

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
)

// AntiScrapConfig holds configuration for the anti-scraping middleware.
type AntiScrapConfig struct {
	BlockedUAs     []string
	HoneypotRoutes []string
	MinUALength    int
	BlockDuration  time.Duration
}

// NewAntiScrapConfig loads config from environment.
func NewAntiScrapConfig(cfg *config.Config) *AntiScrapConfig {
	return &AntiScrapConfig{
		BlockedUAs:     cfg.AntiScrap.BlockedUserAgents,
		HoneypotRoutes: cfg.AntiScrap.HoneypotRoutes,
		MinUALength:    10,
		BlockDuration:  1 * time.Hour,
	}
}

// AntiScrapMiddleware detects and blocks suspicious bot traffic.
func AntiScrapMiddleware(rdb *database.RedisClient, asCfg *AntiScrapConfig) gin.HandlerFunc {
	blockedPatterns := make([]*regexp.Regexp, 0, len(asCfg.BlockedUAs))
	for _, ua := range asCfg.BlockedUAs {
		if pattern, err := regexp.Compile("(?i)" + regexp.QuoteMeta(ua)); err == nil {
			blockedPatterns = append(blockedPatterns, pattern)
		}
	}

	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		// 1. Check Redis blocklist
		if blocked, _ := rdb.Exists(c.Request.Context(), "antiscrap:blocked:"+clientIP); blocked {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "FORBIDDEN", "message": "Access denied"},
			})
			return
		}

		// 2. Check honeypot routes
		path := c.Request.URL.Path
		for _, hp := range asCfg.HoneypotRoutes {
			if strings.HasPrefix(path, hp) {
				rdb.Set(c.Request.Context(), "antiscrap:blocked:"+clientIP, "honeypot", asCfg.BlockDuration)
				rdb.Set(c.Request.Context(),
					fmt.Sprintf("antiscrap:event:%s:%d", clientIP, time.Now().UnixMilli()),
					fmt.Sprintf("honeypot:%s:%s", path, c.GetHeader("User-Agent")),
					24*time.Hour,
				)
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Not found"})
				return
			}
		}

		// 3. Validate User-Agent
		ua := c.GetHeader("User-Agent")
		if len(ua) < asCfg.MinUALength {
			rdb.Set(c.Request.Context(), "antiscrap:blocked:"+clientIP, "short_ua", asCfg.BlockDuration)
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "FORBIDDEN", "message": "Access denied"},
			})
			return
		}

		for _, pattern := range blockedPatterns {
			if pattern.MatchString(ua) {
				rdb.Set(c.Request.Context(), "antiscrap:blocked:"+clientIP, "blocked_ua", asCfg.BlockDuration)
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
					"success": false,
					"error":   gin.H{"code": "FORBIDDEN", "message": "Access denied"},
				})
				return
			}
		}

		// 4. Check missing common headers (Accept-Language, Accept)
		if c.GetHeader("Accept-Language") == "" && c.GetHeader("Accept") == "" {
			c.Set("suspicious_request", true)
		}

		c.Next()
	}
}

// HoneypotHandler returns a 404 for honeypot routes while logging the attempt.
func HoneypotHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Not found"})
	}
}
