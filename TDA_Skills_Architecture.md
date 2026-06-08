# TDA Skills Website — Architecture Plan

## 1. Overview

**Project:** TDA Skills — UK construction training & qualification platform  
**Stack:** Next.js (frontend) + Go (backend) + PostgreSQL + Cloudflare R2 + Redis + WebSocket  
**Payment:** Stripe (Payment Intents API)  
**Admin:** Self-hosted admin panel  
**Tagline:** Get Qualified. Get Certified. Get On Site.

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                          CLIENTS                             │
│         Web (Next.js)  /  Mobile PWA  /  Admin Portal        │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTPS + Anti-Scraping Layer
┌─────────────────────────▼────────────────────────────────────┐
│                       CLOUDFLARE                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │   CDN    │  │    R2    │  │  Bot      │  │   Email    │  │
│  │ (Static) │  │ (Files)  │  │  Manage   │  │  Worker   │  │
│  └──────────┘  └──────────┘  │  + WAF    │  │  (Queue)   │  │
│                             └───────────┘  └────────────┘  │
└─────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                     LOAD BALANCER                             │
│                    (Nginx / Caddy)                            │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌──────────────┐     ┌─────▼──────┐     ┌────────────────┐
│   Next.js    │     │  Go API    │     │  WebSocket     │
│   (SSR)      │────▶│  :8080     │────▶│  Server :8081  │
│   :3000      │     └─────┬──────┘     └────────────────┘
└──────────────┘           │                      ▲
                           │                      │
              ┌────────────▼──┐        ┌──────────┴──────┐
              │    Redis       │        │   PostgreSQL    │
              │ Cache/Sessions │        │   (Primary DB)  │
              │ Rate Limiting  │        └─────────────────┘
              │ Token Blacklist│
              │ Job Queue      │
              └────────────────┘

              ┌────────────────┐
              │ Cloudflare R2  │
              │  (File Storage)│
              └────────────────┘

              ┌────────────────┐
              │  SMTP Server   │
              │  (Custom)      │
              └────────────────┘
```

---

## 3. Frontend (Next.js)

### 3.1 Framework & Libraries
- **Next.js 14** (App Router, Server Components, SSR)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** (TanStack Query) for server state
- **Zustand** for client state (cart, auth, 2FA)
- **Socket.io-client** for WebSocket
- **Stripe React SDK** for payments
- **SMTP.js** or **React Email** for email rendering
- **speakeasy** (or **otplib**) for TOTP 2FA

### 3.2 Directory Structure
```
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── courses/[slug]/page.tsx
│   │   ├── nvqs/
│   │   ├── cscs-cards/
│   │   ├── citb-test/
│   │   ├── about/
│   │   ├── resources/
│   │   └── contact/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── dashboard/
│   │   ├── courses/
│   │   ├── bookings/
│   │   ├── certificates/
│   │   └── profile/
│   │       ├── page.tsx               # Profile overview
│   │       ├── security/page.tsx      # 2FA settings
│   │       ├── notifications/page.tsx
│   │       └── password/page.tsx
│   └── admin/
│       ├── dashboard/
│       ├── courses/
│       ├── bookings/
│       ├── users/
│       ├── analytics/
│       ├── payments/
│       ├── settings/
│       ├── audit-logs/
│       └── profile/                   # Admin own profile
├── components/
│   ├── ui/
│   ├── forms/
│   ├── course/
│   ├── booking/
│   ├── layout/
│   ├── auth/                          # Auth-specific components
│   │   ├── TwoFactorModal.tsx
│   │   ├── PasswordStrengthMeter.tsx
│   │   └── SessionManager.tsx
│   └── email/                         # React Email templates
├── lib/
│   ├── api.ts
│   ├── websocket.ts
│   ├── store.ts
│   └── utils.ts
└── types/
    ├── auth.ts
    ├── course.ts
    ├── booking.ts
    ├── user.ts
    ├── notification.ts
    └── api.ts
```

---

## 4. Backend (Go)

### 4.1 Framework & Libraries
- **Gin** — HTTP router
- **pgx/v5** — PostgreSQL driver
- **sqlx** — Type-safe SQL queries
- **Gorilla WebSocket** — WebSocket handling
- **go-redis/redis/v9** — Redis client
- **stripe-go** — Stripe SDK
- **golang-jwt/jwt/v5** — JWT handling
- **validator/v10** — Request validation
- **bcrypt** — Password hashing
- **otplib** — TOTP for 2FA
- **github.com/google/uuid** — UUID generation

### 4.2 Directory Structure
```
backend/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── middleware/
│   │   ├── auth.go            # JWT validation
│   │   ├── admin_auth.go     # Admin JWT + permissions
│   │   ├── cors.go            # CORS restrictions
│   │   ├── ratelimit.go       # Redis-based rate limiting
│   │   ├── security.go        # HSTS, CSP, XSS headers
│   │   ├── csrf.go            # CSRF protection
│   │   ├── anti_scrap.go      # Anti-scraping logic
│   │   └── audit.go           # Audit log middleware
│   ├── handlers/
│   │   ├── auth.go            # Login, Register, Refresh, Logout, 2FA
│   │   ├── courses.go
│   │   ├── bookings.go
│   │   ├── payments.go
│   │   ├── notifications.go
│   │   ├── uploads.go
│   │   ├── websocket.go
│   │   └── admin/
│   │       ├── dashboard.go
│   │       ├── courses.go
│   │       ├── users.go
│   │       ├── bookings.go
│   │       ├── payments.go
│   │       ├── categories.go
│   │       ├── settings.go
│   │       └── audit.go
│   ├── models/
│   │   ├── user.go
│   │   ├── admin.go
│   │   ├── course.go
│   │   ├── booking.go
│   │   ├── payment.go
│   │   ├── notification.go
│   │   └── setting.go
│   ├── repository/
│   │   ├── user_repo.go
│   │   ├── admin_repo.go
│   │   ├── course_repo.go
│   │   ├── booking_repo.go
│   │   ├── payment_repo.go
│   │   ├── notification_repo.go
│   │   └── setting_repo.go
│   ├── services/
│   │   ├── auth_service.go      # Login, register, 2FA, session management
│   │   ├── course_service.go
│   │   ├── booking_service.go
│   │   ├── payment_service.go
│   │   ├── notification_service.go  # Notification + email worker
│   │   ├── email_service.go         # SMTP email with HTML templates
│   │   └── crypto_service.go       # 2FA TOTP, password reset tokens
│   └── websocket/
│       ├── hub.go
│       └── client.go
├── pkg/
│   ├── cloudflare/
│   │   └── r2.go
│   ├── stripe/
│   │   └── client.go
│   └── email/
│       ├── sender.go           # SMTP client
│       └── templates/          # HTML email templates
│           ├── base.html
│           ├── booking_confirmed.html
│           ├── payment_received.html
│           ├── email_verification.html
│           ├── password_reset.html
│           ├── two_factor_code.html
│           ├── booking_reminder.html
│           ├── admin_alert.html
│           └── newsletter.html
├── migrations/
└── go.mod
```

---

## 5. Database Schema (PostgreSQL)

### 5.1 ER Diagram

```
admins ────────────── admin_audit_logs
  │                   admin_sessions
  │
  └── admin_settings (key-value)

users ──────────────── user_addresses (1:1)
  │                   user_profiles (1:1)
  │                   refresh_tokens (1:M)
  │                   user_sessions (1:M)
  │                   notifications (1:M)
  │                   user_favorites (M:N) ──── courses
  │                   two_factor_secrets (1:1)
  │                   password_reset_tokens (1:1)
  │                   email_verification_tokens (1:1)
  │
  └── bookings (1:M) ─────────── booking_items (M:1) ──── courses
              │
              └── payments (1:M)

course_categories ──── course_category_xref (M:N) ──── courses
course_reviews ─────── courses (1:M)
test_centres ────────── bookings (for CITB)
```

### 5.2 Complete Table Definitions

#### admins
```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin'
        CHECK (role IN ('super_admin', 'admin', 'content_manager', 'support')),
    permissions JSONB NOT NULL DEFAULT '{}',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_active ON admins(is_active) WHERE is_active = TRUE;
```

#### admin_sessions
```sql
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,           -- {browser, os, device_type}
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at) WHERE revoked_at IS NULL;

-- Auto-logout after 1 hour of inactivity (expires_at = created_at + 1 hour)
```

#### admin_audit_logs
```sql
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_entity ON admin_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);
```

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_created ON users(created_at DESC);
```

#### two_factor_secrets
```sql
CREATE TABLE two_factor_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    secret VARCHAR(255) NOT NULL,          -- encrypted TOTP secret
    method VARCHAR(20) DEFAULT 'totp'      -- 'totp' or 'email_code'
        CHECK (method IN ('totp', 'email_code')),
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes JSONB,                    -- hashed backup codes
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_2fa_user ON two_factor_secrets(user_id) WHERE is_enabled = TRUE;
```

#### email_verification_tokens
```sql
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_verify_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verify_expires ON email_verification_tokens(expires_at) WHERE verified_at IS NULL;
```

#### password_reset_tokens
```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_expires ON password_reset_tokens(expires_at) WHERE revoked_at IS NULL;
```

#### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_token ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_expires ON refresh_tokens(expires_at) WHERE revoked_at IS NULL;
```

#### user_sessions
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    two_factor_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at) WHERE revoked_at IS NULL;
```

#### user_addresses
```sql
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    postcode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'United Kingdom',
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### user_profiles
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    employer VARCHAR(255),
    years_experience INTEGER,
    nin_number VARCHAR(20),
    cscs_card_number VARCHAR(50),
    citb_number VARCHAR(50),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    marketing_consent BOOLEAN DEFAULT FALSE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### courses
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'smsts', 'sssts', 'nvq', 'health-safety', 'card', 'citb')),
    sub_category VARCHAR(100),
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'course', 'nvq', 'cscs-card', 'citb-test')),
    short_description TEXT,
    description TEXT,
    who_should_attend TEXT[],
    learning_outcomes JSONB,
    duration VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    price_display VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'GBP',
    images JSONB,
    documents JSONB,
    prerequisites TEXT[],
    eligibility TEXT[],
    certification TEXT[],
    renewal_info TEXT[],
    prerequisites_years_experience INTEGER,
    prerequisites_min_age INTEGER,
    accreditation_body VARCHAR(100),
    accreditation_code VARCHAR(50),
    faq JSONB,
    available_dates JSONB,
    locations JSONB,
    max_students INTEGER DEFAULT 20,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    view_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_active ON courses(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_courses_created ON courses(created_at DESC);
```

#### course_categories
```sql
CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### course_category_xref
```sql
CREATE TABLE course_category_xref (
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES course_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, category_id)
);
```

#### bookings
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN (
            'draft', 'pending', 'pending_payment',
            'confirmed', 'completed', 'cancelled', 'refunded', 'failed')),
    booking_type VARCHAR(30) NOT NULL CHECK (booking_type IN (
        'course', 'nvq', 'cscs-card', 'citb-test', 'package')),
    personal_details JSONB NOT NULL,
    test_details JSONB,
    card_details JSONB,
    nvq_details JSONB,
    source VARCHAR(50) DEFAULT 'web',
    referral_code VARCHAR(50),
    notes TEXT,
    admin_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'GBP',
    created_by UUID REFERENCES admins(id),
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
```

#### booking_items
```sql
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    description TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    discount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
    payment_method VARCHAR(30),
    card_brand VARCHAR(20),
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    receipt_url TEXT,
    receipt_number VARCHAR(50),
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    failure_code VARCHAR(50),
    failure_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'booking', 'payment', 'reminder', 'system', 'promo', 'admin', 'security')),
    channel VARCHAR(20) DEFAULT 'in_app'
        CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
    priority VARCHAR(10) DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    email_job_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_email_pending ON notifications(channel, sent_email) WHERE channel = 'email' AND sent_email = FALSE;
```

#### notification_jobs (email queue)
```sql
CREATE TABLE notification_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    job_type VARCHAR(20) DEFAULT 'email'
        CHECK (job_type IN ('email', 'sms', 'push')),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'retrying')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,
    scheduled_for TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_jobs_status ON notification_jobs(status, scheduled_for)
    WHERE status IN ('pending', 'retrying');
```

#### user_favorites
```sql
CREATE TABLE user_favorites (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    source VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);
```

#### admin_settings
```sql
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES admins(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Keys:
-- site_name, site_tagline, contact_email, contact_phone, address,
-- social_links, maintenance_mode, maintenance_message,
-- smtp_host, smtp_port, smtp_user, smtp_password, smtp_from_name, smtp_from_address, smtp_tls,
-- email_verification_enabled, password_reset_enabled,
-- two_factor_required_for_admin, two_factor_required_for_users,
-- session_timeout_minutes, max_login_attempts, lockout_duration_minutes,
-- rate_limit_auth_per_min, rate_limit_api_per_min,
-- stripe_test_mode, citb_api_key, ...
```

#### test_centres
```sql
CREATE TABLE test_centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    capacity INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### course_reviews
```sql
CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    admin_reply TEXT,
    replied_at TIMESTAMP,
    replied_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_reviews_approved ON course_reviews(is_approved, is_published)
    WHERE is_approved = TRUE AND is_published = TRUE;
```

#### login_activity (security audit)
```sql
CREATE TABLE login_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL
        CHECK (event_type IN (
            'login_success', 'login_failed', 'logout', 'password_changed',
            'email_verified', '2fa_enabled', '2fa_disabled', '2fa_failed',
            'session_expired', 'account_locked', 'account_unlocked')),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_login_activity_user ON login_activity(user_id);
CREATE INDEX idx_login_activity_admin ON login_activity(admin_id);
CREATE INDEX idx_login_activity_created ON login_activity(created_at DESC);
```

---

## 6. Authentication System

### 6.1 User Auth Flow (Production-Ready)

#### Registration
```
1. Client: POST /api/v1/auth/register
   - Validate email format, password strength (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special)
   - Check email not already registered
   - Check rate limit (10 reg/min per IP)

2. Backend:
   - Hash password with bcrypt (cost 12)
   - Create user with email_unverified = false
   - Generate email_verification_token (random 32 bytes, expires 24h)
   - Create email verification notification job
   - Return user + access_token (15min) + refresh_token (7 days)
   - Send welcome email with verification link

3. Email verification flow:
   - User clicks link → GET /api/v1/auth/verify-email?token=xxx
   - Backend: verify token, check expiry, set email_verified = true
   - Show success page or redirect
```

#### Login
```
1. Client: POST /api/v1/auth/login
   - {email, password, device_info}

2. Backend:
   - Check rate limit (5 login attempts/min per IP)
   - Find user by email
   - Check if account is locked (locked_until > now)
   - Verify password against hash
   - If failed:
     - Increment login_attempts
     - If login_attempts >= 5: set is_locked=true, locked_until=now+30min
     - Log 'login_failed' to login_activity
     - Return 401 with generic "Invalid credentials"
   - If success:
     - Reset login_attempts to 0
     - Log 'login_success' to login_activity
     - Check if 2FA is enabled:
       - If YES: return {requires_2fa: true, user_id: "uuid"}
         (do NOT return access token yet)
       - If NO: return full auth (access + refresh tokens)
```

#### 2FA Flow
```
1. Client receives {requires_2fa: true} → show 2FA modal
2. User enters 6-digit TOTP code
3. Client: POST /api/v1/auth/verify-2fa
   - {user_id, code}
4. Backend:
   - Retrieve user's 2FA secret from two_factor_secrets
   - Verify TOTP code (30s window, allow 1 step drift)
   - If valid: generate access_token + refresh_token, return full auth
   - If invalid: log '2fa_failed', return 401
```

#### Password Reset Flow
```
1. Client: POST /api/v1/auth/forgot-password
   - {email}
2. Backend:
   - Always return 200 (same message whether email exists or not)
     to prevent email enumeration attacks
   - If user exists:
     - Generate password_reset_token (random 48 bytes, expires 1h)
     - Store hash of token (never store raw)
     - Send email with reset link: /reset-password?token=xxx
     - Log 'password_reset_requested' to login_activity

3. User clicks email link → GET /api/v1/auth/reset-password-page?token=xxx
   - Backend: verify token exists and not expired
   - Return {valid: true, email: "u***@example.com"} (masked)
   - If invalid/expired: return 400 with "Link expired or invalid"

4. Client: POST /api/v1/auth/reset-password
   - {token, new_password}
   - Validate password strength
5. Backend:
   - Find token record, check not revoked, check not expired
   - Hash new password, update user
   - Revoke token (set revoked_at)
   - Revoke all existing refresh_tokens for user (logout everywhere)
   - Log 'password_changed' to login_activity
   - Send notification email: "Your password was changed"
```

#### Token Refresh
```
1. Client: POST /api/v1/auth/refresh (cookie or body)
   - {refresh_token}
2. Backend:
   - Hash incoming token, find in refresh_tokens
   - Check not expired, not revoked
   - Generate new access_token (15min)
   - Rotate: revoke old refresh_token, create new one
   - Update last_activity on session
```

#### Logout
```
1. Client: POST /api/v1/auth/logout
   - {refresh_token}
2. Backend:
   - Revoke refresh_token (set revoked_at)
   - Add access_token jti to Redis blacklist (until token exp)
   - Log 'logout' to login_activity
```

### 6.2 Two-Factor Authentication (2FA)

#### Setup (User-initiated)
```
1. User goes to /dashboard/profile/security
2. Client: POST /api/v1/auth/2fa/setup
   - Auth required
3. Backend:
   - Generate TOTP secret (Base32, 20 bytes)
   - Store encrypted secret in two_factor_secrets (is_enabled=false)
   - Generate QR code URL (otpauth://totp/TDASkills:user@email.com?secret=XXX&issuer=TDASkills)
   - Generate 10 backup codes (random 8 chars each, hash and store)
   - Return {qr_code_url, secret (for manual entry), backup_codes: [code1, code2, ...]}
4. User scans QR with authenticator app (Google Authenticator, Authy, etc.)
5. User enters TOTP code to verify setup
6. Client: POST /api/v1/auth/2fa/enable
   - {code} (to verify before activating)
7. Backend: verify code, set is_enabled=true on two_factor_secrets
8. Log '2fa_enabled' to login_activity
```

#### Verification (On Login)
```
- If user has 2FA enabled, after password check they must enter TOTP
- Code valid for 30 seconds
- Allow 1 step drift (behind or ahead) for clock skew
- 3 failed 2FA attempts → require re-login (not lock, just invalidate session)
```

#### Backup Codes
```
- User has 10 backup codes
- Each code can only be used once
- Stored as hashed in DB
- Show remaining count after each use
- Option to regenerate all (requires current 2FA code)
```

#### Disable 2FA
```
POST /api/v1/auth/2fa/disable
- {code} (current 2FA code to confirm)
- Backend: verify code, set is_enabled=false, clear secret
- Log '2fa_disabled' to login_activity
```

### 6.3 Admin Auth with Auto-Logout (1 Hour)

```
1. Admin login: POST /api/v1/admin/auth/login
   - Same rate limiting + lockout as user auth
   - On success: create admin_session (expires_at = now + 1 hour)
   - Return access_token (15min) + refresh_token (1h exactly)

2. Every authenticated request:
   - middleware checks token validity
   - checks session.expires_at > now
   - if expired → 401 "Session expired, please login again"
   - updates last_activity on session

3. Token refresh (admin):
   - access_token refreshes normally (15min)
   - if refresh_token is used, new session created with new 1hr expiry
   - old session revoked

4. Admin logout: POST /api/v1/admin/auth/logout
   - Revoke session

5. Session cleanup job (runs every 5 min):
   - DELETE FROM admin_sessions WHERE expires_at < NOW()
```

### 6.4 JWT Token Structure (Users)
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "learner",
  "session_id": "session-uuid",
  "two_factor_verified": true,
  "iat": 1705320000,
  "exp": 1705320900,
  "jti": "token-uuid"
}
```

### 6.5 JWT Token Structure (Admin)
```json
{
  "sub": "admin-uuid",
  "email": "admin@tdaskills.co.uk",
  "role": "admin",
  "permissions": ["courses:read", "courses:write", ...],
  "session_id": "session-uuid",
  "iat": 1705320000,
  "exp": 1705320900,
  "jti": "token-uuid"
}
```

### 6.6 Security Rules Summary
| Feature | Setting |
|---------|---------|
| Password hashing | bcrypt, cost factor 12 |
| Min password length | 8 chars |
| Password requirements | 1 upper, 1 lower, 1 digit, 1 special |
| Login attempts before lock | 5 |
| Lockout duration | 30 minutes |
| Access token expiry | 15 minutes |
| Refresh token expiry | 7 days (users), 1 hour (admin) |
| Admin session expiry | 1 hour (auto-logout) |
| 2FA TOTP window | 30 seconds, 1 step drift |
| 2FA backup codes | 10, single-use |
| Email verification token | 24 hours |
| Password reset token | 1 hour |
| Token blacklist | Redis, until token exp |
| Rate limit (login) | 5 attempts/min per IP |
| Rate limit (register) | 10 attempts/min per IP |
| Rate limit (password reset) | 3 attempts/min per IP |

---

## 7. Email System (SMTP with HTML Templates)

### 7.1 Email Architecture
```
Notification triggered
       │
       ▼
Notification created in DB
       │
       ▼
Notification Job created (queued)
       │
       ▼
Email worker picks up job (Redis queue)
       │
       ▼
Render HTML from template + data
       │
       ▼
Send via SMTP (configurable)
       │
       ▼
Update job status + notification.sent_email
```

### 7.2 SMTP Configuration
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@tdaskills.co.uk
SMTP_PASSWORD=<password>
SMTP_TLS=true
EMAIL_FROM_NAME=TDA Skills
EMAIL_FROM_ADDRESS=noreply@tdaskills.co.uk
EMAIL_REPLY_TO=support@tdaskills.co.uk
```

### 7.3 Email Templates (HTML)

All templates use a consistent base layout with header, content, footer.

#### Template: Base Layout (`base.html`)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{.Subject}}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #1a56db; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 32px 24px; color: #333333; line-height: 1.6; }
    .content h2 { color: #1a56db; margin-top: 0; }
    .content .highlight { background: #f0f4ff; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .content .button { display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0; }
    .content .code { font-family: monospace; font-size: 18px; background: #f4f4f4; padding: 8px 16px; border-radius: 4px; letter-spacing: 2px; }
    .footer { background: #f4f4f4; padding: 16px 24px; text-align: center; font-size: 12px; color: #666666; }
    .footer a { color: #1a56db; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{.SiteName}}</h1>
    </div>
    <div class="content">
      {{.Body}}
    </div>
    <div class="footer">
      <p>{{.SiteName}} &mdash; Get Qualified. Get Certified. Get On Site.</p>
      <p>123 Training Centre, London SW1A 1AA | +44 800 123 4567</p>
      <p><a href="{{.SiteURL}}">Visit Website</a> | <a href="{{.UnsubscribeURL}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
```

#### Template: Email Verification (`email_verification.html`)
```
Subject: Verify your email address - TDA Skills

Body:
<h2>Welcome to TDA Skills!</h2>
<p>Hi {{.FirstName}},</p>
<p>Thank you for registering with TDA Skills. Please verify your email address by clicking the button below:</p>

<div style="text-align: center;">
  <a href="{{.VerificationURL}}" class="button">Verify Email Address</a>
</div>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{.VerificationURL}}</p>

<div class="highlight">
  <strong>Important:</strong> This verification link expires in 24 hours.
</div>

<p>If you didn't create an account with TDA Skills, please ignore this email.</p>
```

#### Template: Password Reset (`password_reset.html`)
```
Subject: Reset your password - TDA Skills

Body:
<h2>Password Reset Request</h2>
<p>Hi {{.FirstName}},</p>
<p>We received a request to reset your password. Click the button below to set a new password:</p>

<div style="text-align: center;">
  <a href="{{.ResetURL}}" class="button">Reset Password</a>
</div>

<p>Or copy and paste this link:</p>
<p style="word-break: break-all; color: #666;">{{.ResetURL}}</p>

<div class="highlight">
  <strong>Important:</strong> This link expires in 1 hour and can only be used once.
</div>

<p>If you didn't request a password reset, please contact us immediately. Your account is secure.</p>
```

#### Template: Booking Confirmation (`booking_confirmed.html`)
```
Subject: Booking Confirmed - {{.BookingNumber}} - TDA Skills

Body:
<h2>Your Booking is Confirmed!</h2>
<p>Hi {{.FirstName}},</p>
<p>Great news! Your booking has been confirmed.</p>

<div class="highlight">
  <strong>Booking Reference:</strong> {{.BookingNumber}}<br>
  <strong>Course:</strong> {{.CourseName}}<br>
  <strong>Date:</strong> {{.CourseDate}}<br>
  <strong>Location:</strong> {{.Location}}<br>
  <strong>Amount Paid:</strong> {{.Amount}}
</div>

<p><strong>What's next?</strong></p>
<ul>
  <li>You will receive a reminder 24 hours before your course</li>
  <li>Bring valid ID and your booking reference</li>
  <li>Arrive 15 minutes before the start time</li>
</ul>

<p>Download your booking confirmation from your <a href="{{.DashboardURL}}">dashboard</a>.</p>

<div style="text-align: center;">
  <a href="{{.DashboardURL}}" class="button">View My Bookings</a>
</div>

<p>If you need to cancel or reschedule, please contact us at least 14 days before the course date.</p>
```

#### Template: Payment Received (`payment_received.html`)
```
Subject: Payment Received - {{.Amount}} - TDA Skills

Body:
<h2>Payment Confirmation</h2>
<p>Hi {{.FirstName}},</p>
<p>We've received your payment of <strong>{{.Amount}}</strong>.</p>

<div class="highlight">
  <strong>Payment Reference:</strong> {{.PaymentNumber}}<br>
  <strong>Booking Reference:</strong> {{.BookingNumber}}<br>
  <strong>Date:</strong> {{.PaymentDate}}<br>
  <strong>Payment Method:</strong> {{.CardBrand}} ending {{.CardLast4}}
</div>

<p>Your receipt is available to download:</p>
<div style="text-align: center;">
  <a href="{{.ReceiptURL}}" class="button">Download Receipt</a>
</div>
```

#### Template: 2FA Code (`two_factor_code.html`)
```
Subject: Your verification code - TDA Skills

Body:
<h2>Your Verification Code</h2>
<p>Hi {{.FirstName}},</p>
<p>Your TDA Skills verification code is:</p>

<div style="text-align: center;">
  <p class="code">{{.Code}}</p>
</div>

<p>This code expires in <strong>5 minutes</strong> and can only be used once.</p>

<div class="highlight">
  <strong>Security Notice:</strong>
  If you did not attempt to log in to your TDA Skills account, your email may have been compromised. Please change your password immediately.
</div>

<p>Never share this code with anyone, including TDA Skills staff.</p>
```

#### Template: Booking Reminder (`booking_reminder.html`)
```
Subject: Reminder: Your course starts tomorrow - {{.CourseName}}

Body:
<h2>Course Reminder</h2>
<p>Hi {{.FirstName}},</p>
<p>This is a reminder that your course is starting tomorrow!</p>

<div class="highlight">
  <strong>Course:</strong> {{.CourseName}}<br>
  <strong>Date:</strong> {{.CourseDate}}<br>
  <strong>Time:</strong> {{.CourseTime}}<br>
  <strong>Location:</strong> {{.Location}}<br>
  <strong>Address:</strong> {{.Address}}
</div>

<p><strong>What to bring:</strong></p>
<ul>
  <li>Valid photo ID (passport or driving licence)</li>
  <li>Your booking confirmation (printed or on phone)</li>
  <li>CITB HS&E Test certificate (if applicable)</li>
</ul>

<p>If you need to reschedule, please contact us as soon as possible.</p>

<div style="text-align: center;">
  <a href="{{.BookingURL}}" class="button">View Booking Details</a>
</div>
```

#### Template: Admin Alert (`admin_alert.html`)
```
Subject: [ALERT] {{.AlertTitle}} - TDA Skills Admin

Body:
<h2>Admin Alert</h2>

<div class="highlight" style="border-left: 4px solid #dc2626;">
  <strong>{{.AlertTitle}}</strong><br>
  {{.AlertMessage}}
</div>

<p><strong>Details:</strong></p>
<ul>
  {{.AlertDetails}}
</ul>

<p><strong>Time:</strong> {{.AlertTime}}</p>
<p><strong>IP:</strong> {{.IPAddress}}</p>

<div style="text-align: center;">
  <a href="{{.AdminURL}}" class="button">View in Admin Panel</a>
</div>
```

#### Template: Password Changed (`password_changed.html`)
```
Subject: Your password has been changed - TDA Skills

Body:
<h2>Password Changed Successfully</h2>
<p>Hi {{.FirstName}},</p>
<p>Your TDA Skills password was changed on {{.ChangedAt}}.</p>

<div class="highlight">
  <strong>If this was you:</strong> No further action is required.<br>
  <strong>If this wasn't you:</strong> Please contact us immediately.
</div>

<p><strong>Details:</strong></p>
<ul>
  <li>Date & Time: {{.ChangedAt}}</li>
  <li>IP Address: {{.IPAddress}}</li>
  <li>Browser/OS: {{.DeviceInfo}}</li>
</ul>

<p>If you suspect unauthorized access, you can <a href="{{.SecurityURL}}">secure your account</a> now.</p>
```

#### Template: New Admin Login (`admin_new_login.html`)
```
Subject: New login to your Admin account - TDA Skills

Body:
<h2>New Admin Login Detected</h2>
<p>Hi {{.AdminName}},</p>
<p>A new login to your TDA Skills admin account was detected:</p>

<div class="highlight">
  <strong>Date:</strong> {{.LoginTime}}<br>
  <strong>IP Address:</strong> {{.IPAddress}}<br>
  <strong>Browser/Device:</strong> {{.DeviceInfo}}<br>
  <strong>Location:</strong> {{.Location}}
</div>

<p><strong>If this was you:</strong> No action needed.</p>
<p><strong>If this wasn't you:</strong> Your account may be compromised. Please contact the super admin immediately and consider enabling 2FA if not already active.</p>

<div style="text-align: center;">
  <a href="{{.AdminProfileURL}}" class="button">Secure Account</a>
</div>
```

### 7.4 Email Template Variables
All templates receive these default variables:
- `{{.SiteName}}` — "TDA Skills"
- `{{.SiteURL}}` — https://tdaskills.co.uk
- `{{.LogoURL}}` — CDN URL for logo
- `{{.UnsubscribeURL}}` — Unsubscribe link
- `{{.CurrentYear}}` — Year for footer

Template-specific variables are listed in each template section above.

### 7.5 Email Worker (Background Job)
- Uses Redis LIST as job queue (`lpush email:jobs ...`)
- Worker polls queue every 5 seconds
- On failure: retry up to 3 times with exponential backoff (5s, 15s, 45s)
- After 3 failures: mark job as 'failed', send to dead letter queue
- Metrics: jobs processed, failed, avg processing time

---

## 8. Notification System Design

### 8.1 Notification Architecture
```
User Action / System Event
         │
         ▼
Notification Service
         │
         ├── Create DB notification record
         │
         ├── Determine channels (in_app, email, sms, push)
         │
         ├── For each channel:
         │   └── Create notification_job record
         │
         └── WebSocket: push to user's room immediately (in_app)

Email Worker (background)
         │
         └── Process email jobs from Redis queue
             │
             ├── Render HTML from template
             │
             ├── Lookup SMTP settings from admin_settings
             │
             ├── Send via SMTP
             │
             └── Update job status + notification.sent_email
```

### 8.2 Notification Types & Channels
| Notification | in_app | Email | SMS | Push |
|-------------|--------|-------|-----|------|
| Booking confirmed | ✓ | ✓ | optional | ✓ |
| Booking cancelled | ✓ | ✓ | ✓ | ✓ |
| Payment succeeded | ✓ | ✓ | ✗ | ✓ |
| Payment failed | ✓ | ✓ | ✓ | ✓ |
| CITB test reminder (24h) | ✓ | ✓ | ✓ | ✓ |
| Course date reminder (7d) | ✓ | ✓ | ✗ | ✓ |
| Email verification | ✓ | ✓ | ✗ | ✗ |
| Password changed | ✓ | ✓ | ✓ | ✓ |
| New admin login (admin) | ✓ | ✓ | ✗ | ✗ |
| 2FA enabled/disabled | ✓ | ✓ | ✗ | ✗ |
| New booking (admin alert) | ✓ | ✓ | ✗ | ✗ |
| Refund processed | ✓ | ✓ | ✗ | ✓ |
| Course review approved | ✓ | ✓ | ✗ | ✗ |

### 8.3 Notification DB Schema
See Section 5 (`notifications` + `notification_jobs` tables)

### 8.4 WebSocket Notification Flow
```
1. Server receives event (e.g., booking confirmed)
2. NotificationService.Create() called
3. Creates notification in DB (channel: in_app)
4. Creates email/sms/push jobs in DB (if applicable)
5. Publishes to Redis pub/sub channel "notifications:{userId}"
6. WebSocket hub receives on pub/sub
7. Hub looks up connected client for userId
8. Sends notification over WebSocket to client
9. Client React app updates notification store → UI badge updates
```

### 8.5 Notification API Endpoints
```
GET /api/v1/notifications
  ?page=1&limit=20&unread_only=false&type=booking
  → Returns paginated notifications for current user

PUT /api/v1/notifications/:id/read
  → Marks single notification as read

PUT /api/v1/notifications/read-all
  → Marks all user's notifications as read

DELETE /api/v1/notifications/:id
  → Soft delete (is_read = true, or remove)

GET /api/v1/notifications/unread-count
  → Returns {count: 3} for header badge
```

---

## 9. Anti-Scraping Security Layer

### 9.1 Defense-in-Depth Architecture

```
Request
  │
  ▼
┌─────────────────────────────────────────────────┐
│  LAYER 1: Cloudflare Bot Management              │
│  - Bot Score (1-100) per request                  │
│  - Verified Bot check (Google, Bing, etc.)        │
│  - JS Challenge for score < 30                    │
│  - CAPTCHA Challenge for score < 15               │
│  - WAF Rule: block known scraper UAs              │
│  - WAF Rule: challenge aggressive patterns       │
└──────────────────────┬──────────────────────────┘
                       │
                      Pass → LAYER 2: Nginx/Caddy
                       Block → 403 Forbidden
  │
  ▼
┌─────────────────────────────────────────────────┐
│  LAYER 2: Nginx / Caddy Rate Limiting             │
│  - Auth endpoints: 5 req/min per IP               │
│  - API general: 60 req/min per IP                │
│  - Course listing: 30 req/min per IP             │
│  - Search: 10 req/min per IP                     │
│  - Connection limit: 100 per IP                  │
└──────────────────────┬──────────────────────────┘
                       │
                      Pass → LAYER 3: Go Middleware
                       Drop → 429 Too Many Requests
  │
  ▼
┌─────────────────────────────────────────────────┐
│  LAYER 3: Go Anti-Scrap Middleware                │
│  - User-Agent validation                         │
│  - Request fingerprinting                        │
│  - Suspicious pattern detection                  │
│  - Honeypot route monitoring                     │
│  - Dynamic blocking (IP + fingerprint)           │
└──────────────────────┬──────────────────────────┘
                       │
                      Pass → Route Handler
                       Block → 403 + log + notify admin
  │
  ▼
┌─────────────────────────────────────────────────┐
│  LAYER 4: API Rate Limiting (Redis)              │
│  - Per-endpoint, per-user, per-IP                │
│  - Sliding window algorithm                     │
│  - Graceful degradation                          │
└─────────────────────────────────────────────────┘
```

### 9.2 Cloudflare WAF Rules
```txt
Rule 1: Block scraper user agents
  - Match: (curl|wget|python|scrapy|phantomjs|selenium|playwright|headless)
  - Action: Block

Rule 2: Challenge suspicious bot scores
  - Match: bot_score < 30
  - Action: JS Challenge

Rule 3: Challenge high request rate
  - Match: rate > 100 req/min
  - Action: CAPTCHA Challenge

Rule 4: Block known scraper IPs (threat list)
  - Match: ip.threat_score > 20
  - Action: Block

Rule 5: Allow verified bots only for API
  - Match: cf.bot_management.bot_score < 50 AND NOT cf.bot_management.verified_bot
  - Action: Challenge
```

### 9.3 Go Anti-Scrap Middleware
```go
type AntiScrapConfig struct {
    // Blocked User-Agent patterns (regex)
    BlockedUAs []string
    // Suspicious path patterns (regex)
    SuspiciousPaths []string
    // Honeypot routes (any hit = blocked)
    HoneypotRoutes []string
    // Min User-Agent length (too short = bot)
    MinUALength int
    // Block duration
    BlockDuration time.Duration
}

func AntiScrapMiddleware(cfg AntiScrapConfig) gin.HandlerFunc {
    // 1. Check honeypot routes
    // 2. Validate User-Agent (length, blocked patterns)
    // 3. Check request fingerprint (header order, timing)
    // 4. Look up IP in Redis blocklist
    // 5. If blocked: log attempt, notify admin via WebSocket, return 403
    // 6. If suspicious but not blocked: add delay, downgrade response (no prices)
}
```

### 9.4 Honeypot System
```
Routes that don't exist in normal app but appear in scraper sitemaps:
- /admin/legacy-login (honeypot)
- /wp-admin (honeypot for WordPress scrapers)
- /api/v1/internal/admin (honeypot)
- /backup.sql (honeypot)
- /database.sql (honeypot)

HTML Form honeypot fields (CSS hidden):
- __hp_username (visible to bots only, ignore if filled)
- __hp_referer (same logic)

On honeypot hit:
1. Log: IP, UA, timestamp, honeypot_route, all headers
2. Add IP to temporary blocklist (Redis, 1 hour)
3. Send admin alert via WebSocket
4. Return generic 404 (don't reveal it's a honeypot)
```

### 9.5 Response Obfuscation (Pricing)
```go
// Sensitive data (price, availability) not rendered in HTML
// until user session is verified
func ObfuscatePricing(c *gin.Context, courses []Course) []Course {
    // Check if user has valid session
    if !hasValidSession(c) {
        // Remove actual prices, replace with "Login to see"
        for i := range courses {
            courses[i].Price = 0
            courses[i].PriceDisplay = "Login to see price"
            courses[i].SalePrice = nil
        }
    }
    return courses
}

// Prices fully visible only for:
// - Logged-in users
// - POST requests (not scraped GET)
// - WebSocket authenticated clients
```

### 9.6 Scraping Detection & Response
```go
type ScrapingEvent struct {
    IP          string
    UserAgent   string
    Path        string
    Fingerprint string  // hash of headers + timing
    Severity    string  // low, medium, high, critical
    Timestamp   time.Time
}

// Redis sorted set: scraping_events:{ip} score=timestamp
// Auto-cleanup events older than 24h

func DetectScraping(c *gin.Context) ScrapingEvent {
    // 1. Check request timing (too fast = bot)
    // 2. Check header order (bots have fixed order)
    // 3. Check missing expected headers (Accept-Language, etc.)
    // 4. Check for automated tool fingerprints
    // 5. Calculate severity score
    // 6. If severity > threshold: block + alert
}
```

### 9.7 Production Anti-Scraping Checklist
- [ ] Cloudflare Bot Management enabled
- [ ] WAF rules for scraper UAs
- [ ] WAF rules for low bot scores
- [ ] Nginx rate limiting configured
- [ ] Go anti-scrap middleware active
- [ ] Honeypot routes deployed
- [ ] Honeypot form fields in place
- [ ] Pricing obfuscation for anonymous users
- [ ] Redis rate limiting on all API endpoints
- [ ] Token blacklist active (logout everywhere)
- [ ] Login attempt lockout (5 attempts = 30min lock)
- [ ] Admin auto-logout (1hr session)
- [ ] 2FA for all admin accounts
- [ ] 2FA available for users
- [ ] Admin IP whitelist option
- [ ] Scraping event logging + alerting
- [ ] Stripe webhook signature verification
- [ ] CAPTCHA on contact form
- [ ] Email rate limiting (3 reset emails/hr)
- [ ] robots.txt (allow search engines, disallow scrapers)

---

## 10. API Reference (Complete)

### 10.1 Auth APIs (Users) — Production Ready

#### POST /api/v1/auth/register
```json
// Request
{
  "email": "learner@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "07123456789",
  "marketing_consent": false
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "learner@example.com",
      "first_name": "John",
      "last_name": "Smith",
      "role": "learner",
      "email_verified": false,
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z"
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900,
    "email_verification_required": true
  }
}

// Error: email exists (409)
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}

// Error: weak password (400)
{
  "success": false,
  "error": {
    "code": "WEAK_PASSWORD",
    "message": "Password must be at least 8 characters and contain uppercase, lowercase, digit and special character"
  }
}
```

#### POST /api/v1/auth/login
```json
// Request
{
  "email": "learner@example.com",
  "password": "SecurePass123!",
  "device_info": {
    "browser": "Chrome 120",
    "os": "Windows 11",
    "device_type": "desktop"
  }
}

// Response 200 (no 2FA)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "learner@example.com",
      "first_name": "John",
      "last_name": "Smith",
      "role": "learner",
      "avatar_url": null,
      "two_factor_enabled": false,
      "last_login": "2024-01-15T10:00:00Z"
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}

// Response 200 (requires 2FA)
{
  "success": true,
  "data": {
    "requires_2fa": true,
    "user_id": "uuid",
    "method": "totp"
  }
}

// Error: invalid credentials (401)
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}

// Error: account locked (403)
{
  "success": false,
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Account locked. Try again after 30 minutes or use password reset",
    "locked_until": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /api/v1/auth/verify-2fa
```json
// Request
{
  "user_id": "uuid",
  "code": "123456"
}

// Response 200
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}

// Error: invalid code (401)
{
  "success": false,
  "error": {
    "code": "INVALID_2FA_CODE",
    "message": "Invalid verification code"
  }
}
```

#### POST /api/v1/auth/refresh
```json
// Request (body)
{ "refresh_token": "eyJ..." }

// Or: Cookie automatically sent (httpOnly, sameSite=strict)
// Response 200
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "expires_in": 900
  }
}

// Error: token revoked/expired (401)
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Session expired, please login again"
  }
}
```

#### POST /api/v1/auth/logout
```json
// Request
{ "refresh_token": "eyJ..." }

// Response 200
{ "success": true, "data": { "message": "Logged out" } }
```

#### GET /api/v1/auth/me
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "learner@example.com",
    "first_name": "John",
    "last_name": "Smith",
    "phone": "07123456789",
    "date_of_birth": "1990-05-15",
    "avatar_url": null,
    "email_verified": true,
    "is_active": true,
    "two_factor_enabled": false,
    "last_login": "2024-01-15T10:30:00Z",
    "created_at": "2023-06-10T09:00:00Z",
    "profile": {...},
    "address": {...}
  }
}
```

#### GET /api/v1/auth/verify-email-page?token=xxx
```json
// Response 200 (valid token)
{
  "success": true,
  "data": {
    "valid": true,
    "email": "learner@example.com"
  }
}

// Response 400 (invalid/expired)
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Verification link is invalid or has expired"
  }
}
```

#### POST /api/v1/auth/verify-email
```json
// Request
{ "token": "xxx" }

// Response 200
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "email_verified": true
  }
}
```

#### POST /api/v1/auth/forgot-password
```json
// Request
{ "email": "learner@example.com" }

// Response 200 (always same message)
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, we've sent a password reset link"
  }
}
```

#### GET /api/v1/auth/reset-password-page?token=xxx
```json
// Response 200
{
  "success": true,
  "data": {
    "valid": true,
    "email_masked": "j***@example.com"
  }
}

// Response 400
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Reset link is invalid or has expired"
  }
}
```

#### POST /api/v1/auth/reset-password
```json
// Request
{
  "token": "xxx",
  "password": "NewSecurePass123!"
}

// Response 200
{
  "success": true,
  "data": {
    "message": "Password reset successful. Please login with your new password.",
    "all_sessions_revoked": true
  }
}
```

---

### 10.2 2FA APIs

#### POST /api/v1/auth/2fa/setup
Auth required.
```json
// Response 200
{
  "success": true,
  "data": {
    "qr_code_url": "otpauth://totp/TDASkills:learner@example.com?secret=JBSWY3DPEHPK3PXP&issuer=TDASkills",
    "secret": "JBSWY3DPEHPK3PXP",
    "backup_codes": [
      "ABCD1234", "EFGH5678", "IJKL9012", ...
    ],
    "message": "Save these backup codes in a safe place. You won't be able to see them again."
  }
}
```

#### POST /api/v1/auth/2fa/enable
Auth required.
```json
// Request
{ "code": "123456" }

// Response 200
{
  "success": true,
  "data": {
    "message": "Two-factor authentication enabled",
    "two_factor_enabled": true,
    "backup_codes_remaining": 10
  }
}
```

#### POST /api/v1/auth/2fa/disable
Auth required.
```json
// Request
{ "code": "123456" }

// Response 200
{
  "success": true,
  "data": {
    "message": "Two-factor authentication disabled",
    "two_factor_enabled": false
  }
}
```

#### POST /api/v1/auth/2fa/verify
Auth required.
```json
// Request
{ "code": "123456" }

// Response 200
{
  "success": true,
  "data": {
    "valid": true,
    "backup_codes_remaining": 10
  }
}
```

#### POST /api/v1/auth/2fa/backup-code
```json
// Request (used when TOTP not available)
{ "user_id": "uuid", "backup_code": "ABCD1234" }

// Response 200 (same as successful 2FA login)
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "backup_code_used": true,
    "backup_codes_remaining": 9
  }
}
```

---

### 10.3 Admin Auth APIs

#### POST /api/v1/admin/auth/login
```json
// Request
{
  "email": "admin@tdaskills.co.uk",
  "password": "AdminPass123!",
  "device_info": {...}
}

// Response 200
{
  "success": true,
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@tdaskills.co.uk",
      "first_name": "Admin",
      "last_name": "User",
      "role": "super_admin",
      "permissions": {...},
      "avatar_url": null,
      "last_login": "2024-01-15T08:00:00Z"
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900,
    "session_expires_at": "2024-01-15T09:00:00Z",
    "requires_2fa": false
  }
}
```

#### GET /api/v1/admin/auth/me
Auth required (1hr session). Returns current admin with session info.
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@tdaskills.co.uk",
    "role": "super_admin",
    "permissions": {...},
    "session": {
      "created_at": "2024-01-15T08:00:00Z",
      "expires_at": "2024-01-15T09:00:00Z",
      "last_activity": "2024-01-15T08:30:00Z",
      "ip_address": "81.2.3.4"
    }
  }
}

// Response 401 (session expired)
{
  "success": false,
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "Your session has expired. Please login again."
  }
}
```

#### POST /api/v1/admin/auth/refresh
Same as user refresh, but new session = new 1hr expiry.

#### POST /api/v1/admin/auth/logout
Revokes admin session immediately.

---

### 10.4 Profile & Security APIs

#### GET /api/v1/dashboard/profile
```json
// Response 200
{
  "success": true,
  "data": {
    "user": {...},
    "profile": {...},
    "address": {...},
    "two_factor_enabled": false,
    "sessions": [
      {
        "id": "uuid",
        "device_info": {"browser": "Chrome", "os": "Windows"},
        "ip_address": "81.2.3.4",
        "created_at": "2024-01-15T08:00:00Z",
        "last_activity": "2024-01-15T08:30:00Z",
        "current": true
      },
      {
        "id": "uuid",
        "device_info": {"browser": "Safari", "os": "iOS"},
        "ip_address": "81.2.3.5",
        "created_at": "2024-01-10T14:00:00Z",
        "last_activity": "2024-01-10T16:00:00Z",
        "current": false
      }
    ],
    "login_history": [
      {
        "event_type": "login_success",
        "ip_address": "81.2.3.4",
        "device_info": {"browser": "Chrome", "os": "Windows"},
        "created_at": "2024-01-15T08:00:00Z"
      }
    ]
  }
}
```

#### PUT /api/v1/dashboard/profile
```json
// Request (partial update)
{
  "first_name": "Jonathan",
  "phone": "07999999999",
  "address": {
    "address_line1": "456 New Street",
    "city": "London",
    "postcode": "SW1A 2BB"
  }
}

// Response 200
{ "success": true, "data": { "user": {...}, "message": "Profile updated" } }
```

#### PUT /api/v1/dashboard/profile/password
```json
// Request
{
  "current_password": "OldPass123!",
  "new_password": "NewSecurePass456!",
  "logout_other_sessions": true
}

// Response 200
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "all_other_sessions_revoked": true
  }
}

// Error: wrong current password (400)
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

#### DELETE /api/v1/dashboard/profile/sessions/:session_id
Revoke a specific login session (logout from that device).

#### DELETE /api/v1/dashboard/profile/sessions/All
Revoke all sessions except current.

---

### 10.5 Course APIs, Booking APIs, Payment APIs, Admin APIs
(See prior document — all endpoints fully documented with request/response JSON)

---

## 11. Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | VALIDATION_ERROR | Request body/params failed validation |
| 400 | WEAK_PASSWORD | Password doesn't meet requirements |
| 400 | INVALID_CREDENTIALS | Login credentials incorrect |
| 400 | EMAIL_EXISTS | Email already registered |
| 400 | BOOKING_NOT_MODIFIABLE | Cannot change booking in current status |
| 401 | UNAUTHORIZED | Missing or invalid JWT |
| 401 | TOKEN_EXPIRED | Access token has expired |
| 401 | TOKEN_REVOKED | Token has been revoked (logout) |
| 401 | SESSION_EXPIRED | Admin session expired (1hr auto-logout) |
| 401 | REQUIRES_2FA | Login successful but 2FA required |
| 401 | INVALID_2FA_CODE | TOTP/backup code invalid |
| 401 | INVALID_TOKEN | Email verification or reset token invalid/expired |
| 403 | FORBIDDEN | Insufficient permissions |
| 403 | ACCOUNT_LOCKED | Account locked (too many failed attempts) |
| 403 | IP_WHITELIST_REQUIRED | Admin access from untrusted IP |
| 403 | 2FA_NOT_ENABLED | Attempted 2FA verify but not enabled |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate resource |
| 422 | PAYMENT_FAILED | Stripe payment failed |
| 422 | SLOT_UNAVAILABLE | Course date slot no longer available |
| 429 | RATE_LIMITED | Too many requests |
| 429 | TOO_MANY_LOGIN_ATTEMPTS | Account temporarily locked |
| 500 | INTERNAL_ERROR | Unexpected server error |
| 503 | SERVICE_UNAVAILABLE | Maintenance mode |

---

## 12. Environment Variables

### Backend (.env)
```env
# Server
PORT=8080
GIN_MODE=release
ENV=production

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=tdaskills
POSTGRES_USER=tdaskills
POSTGRES_PASSWORD=<strong-password>
POSTGRES_MAX_CONN=25
POSTGRES_IDLE_CONN=5

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
REDIS_DB=0

# JWT
JWT_SECRET=<generate-64-chars>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h
JWT_ISSUER=tdaskills

# Security
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=30
SESSION_TIMEOUT_MINUTES=60
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_DIGIT=true
PASSWORD_REQUIRE_SPECIAL=true

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_R2_ACCESS_KEY=<key>
CLOUDFLARE_R2_SECRET_KEY=<secret>
CLOUDFLARE_R2_BUCKET=tdaskills
CLOUDFLARE_R2_PUBLIC_URL=https://tdaskills.r2.dev

# SMTP (Email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@tdaskills.co.uk
SMTP_PASSWORD=<password>
SMTP_TLS=true
SMTP_TLS_INSECURE_SKIP=false
EMAIL_FROM_NAME=TDA Skills
EMAIL_FROM_ADDRESS=noreply@tdaskills.co.uk
EMAIL_REPLY_TO=support@tdaskills.co.uk

# Email Settings
EMAIL_VERIFICATION_ENABLED=true
PASSWORD_RESET_ENABLED=true
TWO_FACTOR_REQUIRED_FOR_ADMIN=false
TWO_FACTOR_REQUIRED_FOR_USERS=false

# Admin
ADMIN_IP_WHITELIST=1.2.3.4,5.6.7.8
CORS_ORIGINS=https://tdaskills.co.uk,https://www.tdaskills.co.uk

# Anti-Scraping
ANTI_SCRAP_ENABLED=true
HONEYPOT_ROUTES=/admin/legacy-login,/wp-admin,/api/v1/internal
BLOCKED_USER_AGENTS=curl,wget,python,scrapy,phantomjs
RATE_LIMIT_AUTH=5
RATE_LIMIT_API=60
RATE_LIMIT_SEARCH=10
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.tdaskills.co.uk
NEXT_PUBLIC_WS_URL=wss://api.tdaskills.co.uk
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SITE_URL=https://tdaskills.co.uk
NEXT_PUBLIC_SITE_NAME=TDA Skills
```

---

## 13. Development Phases

### Phase 1: Foundation (2 weeks)
- [ ] Project setup (Next.js, Go, Postgres, Redis)
- [ ] Database schema + migrations
- [ ] Auth system: register, login, logout, JWT, sessions (users + admins)
- [ ] Password hashing, login lockout, rate limiting
- [ ] Email verification flow
- [ ] Docker Compose for local dev

### Phase 2: 2FA + Security (1 week)
- [ ] TOTP 2FA setup/enable/disable/verify
- [ ] Backup codes
- [ ] Admin auto-logout (1hr session)
- [ ] Login activity logging
- [ ] Session management (view sessions, revoke sessions)
- [ ] Password change with logout everywhere

### Phase 3: Email System (1 week)
- [ ] SMTP client setup
- [ ] Email templates (base layout + all templates)
- [ ] Email worker (Redis queue)
- [ ] Notification service (in_app + email + SMS)
- [ ] WebSocket notification push

### Phase 4: Core Public Features (2 weeks)
- [ ] Course listing & detail pages (SSR with pricing obfuscation)
- [ ] NVQ pages
- [ ] CSCS card pages
- [ ] CITB test pages
- [ ] Homepage
- [ ] Contact page

### Phase 5: Booking & Payments (2 weeks)
- [ ] Shopping cart
- [ ] Stripe Payment Intents
- [ ] Checkout flow
- [ ] Booking confirmation + email
- [ ] Webhook handler
- [ ] Booking management (learner)

### Phase 6: Learner Dashboard (1 week)
- [ ] Dashboard layout
- [ ] My bookings
- [ ] Profile + security settings
- [ ] Notification preferences
- [ ] Session management

### Phase 7: Admin Panel (2 weeks)
- [ ] Admin auth + 1hr auto-logout
- [ ] Admin 2FA
- [ ] Dashboard with analytics + charts
- [ ] Course CRUD
- [ ] Booking management
- [ ] User management + login activity
- [ ] Payment oversight + refunds
- [ ] Audit logs
- [ ] Settings management

### Phase 8: Anti-Scraping + Polish (1 week)
- [ ] Cloudflare WAF rules
- [ ] Go anti-scrap middleware
- [ ] Honeypot routes
- [ ] Honeypot form fields
- [ ] Pricing obfuscation
- [ ] Admin IP whitelist
- [ ] Performance optimization
- [ ] Email template testing

---

## 14. Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 200ms |
| API p95 | < 200ms |
| WebSocket latency | < 50ms |
| Email job processing | < 5s |
| Uptime | 99.9% |