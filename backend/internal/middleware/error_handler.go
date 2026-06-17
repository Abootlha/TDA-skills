package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// ErrorResponse is the standard error format returned by all API endpoints.
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details any    `json:"details,omitempty"`
}

// Recovery overrides gin's default recovery to return structured JSON and log the panic.
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[PANIC] %v\n%s", r, debug.Stack())
				c.AbortWithStatusJSON(http.StatusInternalServerError, ErrorResponse{
					Error: "An unexpected server error occurred. Please try again.",
					Code:  "INTERNAL_SERVER_ERROR",
				})
			}
		}()
		c.Next()
	}
}

// ErrorHandler is a middleware that formats unhandled errors set via c.Error().
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Only handle if there are errors and no response has been written
		if len(c.Errors) > 0 && !c.Writer.Written() {
			err := c.Errors.Last()
			log.Printf("[ERROR] %s %s -> %v", c.Request.Method, c.Request.URL.Path, err.Err)

			status := http.StatusInternalServerError
			resp := ErrorResponse{Error: "An unexpected error occurred.", Code: "INTERNAL_SERVER_ERROR"}

			// Map known error types to HTTP codes
			switch err.Type {
			case gin.ErrorTypeBind:
				status = http.StatusBadRequest
				resp = ErrorResponse{Error: "Invalid request data.", Code: "VALIDATION_ERROR"}
			case gin.ErrorTypePublic:
				status = http.StatusBadRequest
				resp = ErrorResponse{Error: err.Error(), Code: "BAD_REQUEST"}
			}

			c.JSON(status, resp)
		}
	}
}
