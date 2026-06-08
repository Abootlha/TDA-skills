package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// RateLimitConfig defines rate limiting parameters.
type RateLimitConfig struct {
	MaxRequests int
	Window      time.Duration
	KeyPrefix   string
}

// RateLimiter creates a generic Redis-based rate limiting middleware.
func RateLimiter(rdb *redis.Client, cfg RateLimitConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		key := fmt.Sprintf("ratelimit:%s:%s", cfg.KeyPrefix, clientIP)

		ctx := context.Background()

		count, err := rdb.Incr(ctx, key).Result()
		if err != nil {
			c.Next()
			return
		}

		if count == 1 {
			rdb.Expire(ctx, key, cfg.Window)
		}

		ttl, _ := rdb.TTL(ctx, key).Result()

		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", cfg.MaxRequests))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", max(0, int64(cfg.MaxRequests)-count)))
		c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(ttl).Unix()))

		if count > int64(cfg.MaxRequests) {
			c.Header("Retry-After", fmt.Sprintf("%d", int(ttl.Seconds())))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "Too many requests",
				"retry_after": int(ttl.Seconds()),
			})
			return
		}

		c.Next()
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth-specific strict rate limiter
// ─────────────────────────────────────────────────────────────────────────────

const (
	authBanDuration = 15 * time.Minute
	authMaxRequests = 60
	authWindow      = 1 * time.Minute
	authCookieName  = "tda_session" // session cookie name used by the app
)

// authLuaScript is a Lua script executed atomically on Redis.
//
// It performs ALL of these in a single round-trip (no race conditions):
//  1. Check if the IP ban key already exists → return immediately if banned
//  2. Increment the per-IP sliding-window counter
//  3. Set the window expiry on the first request of a window
//  4. If count > limit → set the IP ban key (+ cookie ban key if provided) → return blocked
//  5. Otherwise return the current count + remaining TTL
//
// Return values (array of two integers):
//
//	[status, ttl_seconds]
//	  status == -1  → IP is already banned   (ttl = remaining ban seconds)
//	  status == -2  → just got banned now     (ttl = authBanDuration seconds)
//	  status >= 1   → request allowed, status = current count
var authLuaScript = redis.NewScript(`
local ban_key      = KEYS[1]   -- auth:ban:ip:<IP>
local counter_key  = KEYS[2]   -- auth:rate:ip:<IP>
local cookie_key   = KEYS[3]   -- auth:ban:cookie:<value>  (may be empty string "")
local limit        = tonumber(ARGV[1])
local window_secs  = tonumber(ARGV[2])
local ban_secs     = tonumber(ARGV[3])
local has_cookie   = ARGV[4]   -- "1" if cookie key is set, "0" otherwise

-- 1. Already banned?
local ban_ttl = redis.call('TTL', ban_key)
if ban_ttl > 0 then
    return {-1, ban_ttl}
end

-- 2. Increment sliding-window counter
local count = redis.call('INCR', counter_key)

-- 3. Set expiry on first request
if count == 1 then
    redis.call('EXPIRE', counter_key, window_secs)
end

local remaining_ttl = redis.call('TTL', counter_key)

-- 4. Limit exceeded → ban immediately
if count > limit then
    redis.call('SET', ban_key, 1, 'EX', ban_secs)
    if has_cookie == '1' then
        redis.call('SET', cookie_key, 1, 'EX', ban_secs)
    end
    return {-2, ban_secs}
end

-- 5. Allowed
return {count, remaining_ttl}
`)

// AuthRateLimiter is a strict, race-condition-free rate limiter for
// /login and /register endpoints, backed by a Redis Lua script.
//
// Rules:
//   - 60 requests / minute per IP.
//   - The moment the 61st request arrives (even concurrently), the Lua script
//     atomically bans the IP for 15 minutes before any further request can
//     sneak through.  No goroutine can observe an intermediate state.
//   - The client's session cookie is also banned, so rotating IPs cannot bypass
//     the block.
//   - Subsequent requests to the endpoint (even from a burst of 1000) are
//     rejected at the very first Redis call — zero unnecessary server work.
func AuthRateLimiter(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		clientIP := c.ClientIP()
		cookieVal, _ := c.Cookie(authCookieName)

		ipBanKey := fmt.Sprintf("auth:ban:ip:%s", clientIP)
		counterKey := fmt.Sprintf("auth:rate:ip:%s", clientIP)
		cookieBanKey := fmt.Sprintf("auth:ban:cookie:%s", cookieVal)
		hasCookie := "0"
		if cookieVal != "" {
			hasCookie = "1"
		}

		// ── Fast-path: cookie ban check (pure Go, before Lua) ──────────────
		// Lua handles the IP ban atomically, but for the cookie we do a
		// pre-check here so banned cookie holders are rejected immediately
		// even when coming from a fresh IP.
		if cookieVal != "" {
			banned, err := rdb.Exists(ctx, cookieBanKey).Result()
			if err == nil && banned > 0 {
				ttl, _ := rdb.TTL(ctx, cookieBanKey).Result()
				c.Header("Retry-After", fmt.Sprintf("%d", int(ttl.Seconds())))
				c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
					"error":       "Your session has been temporarily blocked due to too many requests",
					"retry_after": int(ttl.Seconds()),
				})
				return
			}
		}

		// ── Atomic Lua script: ban-check + increment + auto-ban ────────────
		result, err := authLuaScript.Run(
			ctx, rdb,
			[]string{ipBanKey, counterKey, cookieBanKey},
			authMaxRequests,
			int(authWindow.Seconds()),
			int(authBanDuration.Seconds()),
			hasCookie,
		).Int64Slice()

		if err != nil {
			// Redis unavailable — fail open (do not block legitimate traffic)
			c.Next()
			return
		}

		status := result[0]
		ttlSecs := result[1]

		switch {
		case status == -1:
			// IP was already banned before this request
			c.Header("Retry-After", fmt.Sprintf("%d", ttlSecs))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "Your IP is temporarily blocked. Try again later",
				"retry_after": ttlSecs,
			})

		case status == -2:
			// This request was the one that triggered the ban
			c.Header("Retry-After", fmt.Sprintf("%d", ttlSecs))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "Too many requests. Your IP and session have been blocked for 15 minutes",
				"retry_after": ttlSecs,
			})

		default:
			// Allowed — set informational headers and continue
			remaining := int64(authMaxRequests) - status
			if remaining < 0 {
				remaining = 0
			}
			c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", authMaxRequests))
			c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
			c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Unix()+ttlSecs))
			c.Next()
		}
	}
}

// DefaultRateLimits returns common rate limit configurations.
func DefaultRateLimits() map[string]RateLimitConfig {
	return map[string]RateLimitConfig{
		"auth": {
			MaxRequests: authMaxRequests,
			Window:      authWindow,
			KeyPrefix:   "auth",
		},
		"courses": {
			MaxRequests: 60,
			Window:      1 * time.Minute,
			KeyPrefix:   "courses",
		},
		"bookings": {
			MaxRequests: 30,
			Window:      1 * time.Minute,
			KeyPrefix:   "bookings",
		},
		"payments": {
			MaxRequests: 20,
			Window:      1 * time.Minute,
			KeyPrefix:   "payments",
		},
		"general": {
			MaxRequests: 100,
			Window:      1 * time.Minute,
			KeyPrefix:   "general",
		},
	}
}
