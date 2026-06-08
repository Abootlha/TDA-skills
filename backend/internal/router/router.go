package router

import (
	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
	"github.com/tdaskills/backend/internal/handlers"
	adminHandlers "github.com/tdaskills/backend/internal/handlers/admin"
	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/repository"
	"github.com/tdaskills/backend/internal/services"
	ws "github.com/tdaskills/backend/internal/websocket"
)

// SetupRouter creates and configures the Gin router with all routes.
func SetupRouter(cfg *config.Config, pg *database.PostgresDB, rdb *database.RedisClient, hub *ws.Hub) *gin.Engine {
	gin.SetMode(cfg.Server.GinMode)
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Global middleware
	r.Use(middleware.CORSMiddleware(cfg))
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.RequestID())

	// Anti-scraping middleware (if enabled)
	if cfg.AntiScrap.Enabled {
		asCfg := middleware.NewAntiScrapConfig(cfg)
		r.Use(middleware.AntiScrapMiddleware(rdb, asCfg))
	}

	// Rate limit configs
	rateLimits := middleware.DefaultRateLimits()

	// --- Repositories ---
	userRepo := repository.NewUserRepository(pg.DB)
	adminRepo := repository.NewAdminRepository(pg.DB)
	courseRepo := repository.NewCourseRepository(pg.DB)
	bookingRepo := repository.NewBookingRepository(pg.DB)
	paymentRepo := repository.NewPaymentRepository(pg.DB)
	notifRepo := repository.NewNotificationRepository(pg.DB)

	// --- Services ---
	cryptoService := services.NewCryptoService(pg.DB)
	authService := services.NewAuthService(userRepo, adminRepo, rdb, cfg, cryptoService)
	emailService := services.NewEmailService(cfg, pg.DB, rdb)
	courseService := services.NewCourseService(courseRepo, rdb)
	bookingService := services.NewBookingService(bookingRepo, courseRepo)
	paymentService := services.NewPaymentService(paymentRepo, bookingRepo, cfg)
	notifService := services.NewNotificationService(notifRepo)

	// --- Handlers ---
	authHandler := handlers.NewAuthHandler(authService, cryptoService, emailService)
	profileHandler := handlers.NewProfileHandler(userRepo, authService, cryptoService, emailService)
	courseHandler := handlers.NewCourseHandler(courseService)
	nvqHandler := handlers.NewNVQHandler(courseService)
	cardHandler := handlers.NewCardHandler(courseService)
	bookingHandler := handlers.NewBookingHandler(bookingService)
	citbHandler := handlers.NewCITBHandler(bookingService)
	paymentHandler := handlers.NewPaymentHandler(paymentService, cfg)
	notifHandler := handlers.NewNotificationHandler(notifService)
	uploadHandler := handlers.NewUploadHandler()
	wsHandler := handlers.NewWebSocketHandler(hub, cfg)
	checkoutHandler := handlers.NewCheckoutHandler(rdb)

	// Admin handlers
	adminAuthHandler := adminHandlers.NewAdminAuthHandler(adminRepo, authService, cryptoService, emailService)
	dashboardHandler := adminHandlers.NewDashboardHandler(adminRepo, authService)
	adminCourseHandler := adminHandlers.NewAdminCourseHandler(courseService)
	adminUserHandler := adminHandlers.NewAdminUserHandler(userRepo)
	adminBookingHandler := adminHandlers.NewAdminBookingHandler(bookingService)
	adminPaymentHandler := adminHandlers.NewAdminPaymentHandler(paymentService)
	settingsHandler := adminHandlers.NewSettingsHandler(adminRepo)
	auditHandler := adminHandlers.NewAuditHandler(pg.DB)

	// --- Health check ---
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "tdaskills-api"})
	})

	// --- WebSocket ---
	r.GET("/ws", wsHandler.HandleConnect)

	// --- Honeypot routes (if configured) ---
	for _, route := range cfg.AntiScrap.HoneypotRoutes {
		r.Any(route, middleware.HoneypotHandler())
	}
	// Additional common honeypot targets
	r.Any("/wp-admin", middleware.HoneypotHandler())
	r.Any("/backup.sql", middleware.HoneypotHandler())
	r.Any("/database.sql", middleware.HoneypotHandler())

	// === API v1 ===
	v1 := r.Group("/api/v1")

	// --- Auth (public) ---
	auth := v1.Group("/auth")

	// /register and /login get the strict auth rate limiter:
	// 60 req/min per IP; breach → 15-min ban on IP + session cookie
	authStrict := auth.Group("")
	authStrict.Use(middleware.AuthRateLimiter(rdb.Client))
	{
		authStrict.POST("/register", authHandler.Register)
		authStrict.POST("/login", authHandler.Login)
	}

	// Remaining auth endpoints use the generic rate limiter
	auth.Use(middleware.RateLimiter(rdb.Client, rateLimits["auth"]))
	{
		auth.POST("/refresh", authHandler.Refresh)
		auth.POST("/verify-2fa", authHandler.Verify2FA)
		auth.POST("/2fa/backup-code", authHandler.UseBackupCode)

		// Email verification
		auth.GET("/verify-email-page", authHandler.VerifyEmailPage)
		auth.POST("/verify-email", authHandler.VerifyEmail)

		// Password reset
		auth.POST("/forgot-password", authHandler.ForgotPassword)
		auth.GET("/reset-password-page", authHandler.ResetPasswordPage)
		auth.POST("/reset-password", authHandler.ResetPassword)
	}

	// Auth (protected)
	authProtected := v1.Group("/auth")
	authProtected.Use(middleware.AuthMiddleware(cfg))
	{
		authProtected.POST("/logout", authHandler.Logout)
		authProtected.GET("/me", authHandler.GetMe)

		// 2FA management (requires auth)
		authProtected.POST("/2fa/setup", profileHandler.Setup2FA)
		authProtected.POST("/2fa/enable", profileHandler.Enable2FA)
		authProtected.POST("/2fa/disable", profileHandler.Disable2FA)
	}

	// --- Dashboard / Profile (protected) ---
	dashboard := v1.Group("/dashboard")
	dashboard.Use(middleware.AuthMiddleware(cfg))
	{
		dashboard.GET("/profile", profileHandler.GetProfile)
		dashboard.PUT("/profile", profileHandler.UpdateProfile)
		dashboard.PUT("/profile/password", profileHandler.ChangePassword)
		dashboard.DELETE("/profile/sessions/:session_id", profileHandler.RevokeSession)
		dashboard.DELETE("/profile/sessions/all", profileHandler.RevokeAllSessions)
	}

	// --- Courses (public) ---
	courses := v1.Group("/courses")
	courses.Use(middleware.RateLimiter(rdb.Client, rateLimits["courses"]))
	{
		courses.GET("", courseHandler.List)
		courses.GET("/categories", courseHandler.GetCategories)
		courses.GET("/:slug", courseHandler.GetBySlug)
	}

	// --- NVQs (public) ---
	nvqs := v1.Group("/nvqs")
	{
		nvqs.GET("", nvqHandler.List)
		nvqs.GET("/:level", nvqHandler.ListByLevel)
	}

	// --- CSCS Cards (public) ---
	cards := v1.Group("/cards")
	{
		cards.GET("", cardHandler.List)
		cards.GET("/:type", cardHandler.GetByType)
		cards.POST("/apply", cardHandler.Apply)
	}

	// --- CITB Tests (public) ---
	tests := v1.Group("/tests")
	{
		tests.GET("/centres", citbHandler.ListCentres)
		tests.GET("/availability", citbHandler.CheckAvailability)
		tests.POST("/book", citbHandler.Book)
		tests.GET("/:id", citbHandler.GetByID)
	}

	// --- Checkout (public / guest session via header) ---
	checkout := v1.Group("/checkout")
	{
		checkout.GET("/draft", checkoutHandler.GetDraft)
		checkout.POST("/draft", checkoutHandler.SaveDraft)
		checkout.DELETE("/draft", checkoutHandler.DeleteDraft)
	}

	// --- Bookings (protected) ---
	bookings := v1.Group("/bookings")
	bookings.Use(middleware.AuthMiddleware(cfg))
	bookings.Use(middleware.RateLimiter(rdb.Client, rateLimits["bookings"]))
	{
		bookings.GET("", bookingHandler.List)
		bookings.GET("/:id", bookingHandler.GetByID)
		bookings.POST("", bookingHandler.Create)
		bookings.PUT("/:id", bookingHandler.Update)
		bookings.DELETE("/:id", bookingHandler.Cancel)
	}

	// --- Payments (protected) ---
	payments := v1.Group("/payments")
	payments.Use(middleware.RateLimiter(rdb.Client, rateLimits["payments"]))
	{
		// Webhook is public (Stripe calls it)
		payments.POST("/webhook", paymentHandler.Webhook)
	}
	paymentsProtected := v1.Group("/payments")
	paymentsProtected.Use(middleware.AuthMiddleware(cfg))
	{
		paymentsProtected.POST("/create-intent", paymentHandler.CreateIntent)
		paymentsProtected.POST("/confirm", paymentHandler.Confirm)
		paymentsProtected.GET("/:id", paymentHandler.GetByID)
	}

	// --- Notifications (protected) ---
	notifs := v1.Group("/notifications")
	notifs.Use(middleware.AuthMiddleware(cfg))
	{
		notifs.GET("", notifHandler.List)
		notifs.PUT("/:id/read", notifHandler.MarkAsRead)
		notifs.PUT("/read-all", notifHandler.MarkAllAsRead)
		notifs.DELETE("/:id", notifHandler.Delete)
		notifs.GET("/unread-count", notifHandler.UnreadCount)
	}

	// --- Upload (protected) ---
	upload := v1.Group("/upload")
	upload.Use(middleware.AuthMiddleware(cfg))
	{
		upload.POST("/presign", uploadHandler.Presign)
	}

	// === Admin Routes ===

	// Admin auth (public, rate-limited)
	adminAuth := v1.Group("/admin/auth")
	adminAuth.Use(middleware.RateLimiter(rdb.Client, rateLimits["auth"]))
	{
		adminAuth.POST("/login", adminAuthHandler.Login)
	}

	// Admin protected routes
	adminProtected := v1.Group("/admin")
	adminProtected.Use(middleware.AdminAuthMiddleware(cfg, rdb))
	adminProtected.Use(middleware.AdminIPWhitelist(cfg))
	adminProtected.Use(middleware.AuditMiddleware(pg.DB))
	{
		// Admin auth management
		adminProtected.GET("/auth/me", adminAuthHandler.GetMe)
		adminProtected.POST("/auth/refresh", adminAuthHandler.Refresh)
		adminProtected.POST("/auth/logout", adminAuthHandler.Logout)

		// Dashboard
		adminProtected.GET("/dashboard", dashboardHandler.GetStats)

		// Courses CRUD
		adminProtected.GET("/courses", adminCourseHandler.List)
		adminProtected.POST("/courses", adminCourseHandler.Create)
		adminProtected.PUT("/courses/:id", adminCourseHandler.Update)
		adminProtected.DELETE("/courses/:id", adminCourseHandler.Delete)

		// Users
		adminProtected.GET("/users", adminUserHandler.List)
		adminProtected.GET("/users/:id", adminUserHandler.GetByID)
		adminProtected.PUT("/users/:id", adminUserHandler.Update)

		// Bookings
		adminProtected.GET("/bookings", adminBookingHandler.List)
		adminProtected.PUT("/bookings/:id", adminBookingHandler.UpdateStatus)

		// Payments
		adminProtected.GET("/payments", adminPaymentHandler.List)
		adminProtected.POST("/payments/refund", paymentHandler.Refund)

		// Audit logs
		adminProtected.GET("/audit-logs", auditHandler.List)
		adminProtected.GET("/login-activity", auditHandler.LoginActivity)

		// Settings
		adminProtected.GET("/settings", settingsHandler.List)
		adminProtected.GET("/settings/:key", settingsHandler.GetByKey)
		adminProtected.PUT("/settings/:key", settingsHandler.Update)
	}

	return r
}
