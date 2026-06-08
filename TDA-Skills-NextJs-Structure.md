# TDA Skills — Next.js Project Structure & UI Specification

## 1. Pages

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Home | `/` | Landing page with hero, stats, courses overview, testimonials, footer |
| 2 | About Us | `/about` | Mission, values, team members, company story |
| 3 | Courses | `/courses` | Course catalog with search, category filters, sorting |
| 4 | Course Detail | `/courses/[slug]` | Individual course page with syllabus, dates, booking |
| 5 | NVQs & Qualifications | `/nvqs` | Qualification categories (Business, Construction, Health & Safety, Healthcare) |
| 6 | NVQ Category | `/nvqs/[category]` | Filtered NVQ listings with consultation form |
| 7 | CSCS & CPCS | `/cscs` | Green/Blue/Gold CSCS card info, packages, how-it-works |
| 8 | CITB Test Booking | `/citb-test` | Multi-step booking: Test Selection → Date/Time → Candidate Details → Booking Summary → Payment |
| 9 | Cart/Checkout | `/checkout` | Cart with delegate details, promo codes, payment |
| 10 | Booking Confirmed | `/booking-confirmed` | Success page with booking ID and next steps |
| 11 | Learner Portal | `/portal` | Dashboard: progress, active courses, certificates, upcoming exams |
| 12 | Contact Us | `/contact` | Contact form + office info |

---

## 2. Shared Components

### Navigation
- **Navbar** — Logo, nav links (Home, Courses, NVQs & Qualifications, CSCS & CPCS, CITB Test, About Us, Resources), CTA button, mobile hamburger
- **Footer** — Logo, quick links columns, contact info, business hours, social links, legal links, newsletter signup, copyright

### Reusable UI Blocks
- **CourseCard** — Image, badge (Best Seller / Highly Rated / New), title, description, price, duration, location, rating, CTA button
- **QualificationCard** — Category icon, title, description, "View Courses" button
- **StatBadge** — Icon + number + label (e.g. "50k+ Workers", "98% Pass Rate", "100+ Courses")
- **TestimonialCard** — Quote, avatar, name, role
- **TeamMemberCard** — Photo, name, title
- **DateLocationCard** — Date range, location, seats remaining, book button
- **StepIndicator** — Numbered steps for multi-step flows (CITB booking)
- **BookingSummaryCard** — Itemized order summary with totals and VAT
- **ProgressRing** — Circular progress indicator (e.g. 78%)
- **CourseTimeline** — Ordered steps (e.g. How It Works: 01–06)
- **Accordion/FAQ** — Expandable Q&A sections
- **Badge** — Status labels (Most Popular, Best Seller, Highly Rated, Limited Availability)
- **Button** — Variants: primary, secondary, outline, ghost; sizes: sm, md, lg
- **Input / Select / Textarea** — Form fields with labels and validation states
- **PromoCodeInput** — Collapsible promo code field in cart
- **RatingStars** — Star display for reviews
- **Breadcrumb** — Page path navigation
- **SkeletonLoader** — Loading placeholder for async content
- **Toast/Alert** — Success, error, info notification banners

---

## 3. File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (Navbar + Footer)
│   ├── page.tsx                    # Home
│   ├── about/
│   │   └── page.tsx                # About Us
│   ├── courses/
│   │   ├── page.tsx                # Courses catalog
│   │   └── [slug]/
│   │       └── page.tsx           # Course detail
│   ├── nvqs/
│   │   ├── page.tsx                # NVQs overview
│   │   └── [category]/
│   │       └── page.tsx           # NVQ category detail
│   ├── cscs/
│   │   └── page.tsx               # CSCS & CPCS cards
│   ├── citb-test/
│   │   ├── page.tsx               # CITB test booking (multi-step)
│   │   └── confirmation/
│   │       └── page.tsx           # Booking confirmed
│   ├── checkout/
│   │   ├── page.tsx               # Cart & checkout
│   │   └── confirmation/
│   │       └── page.tsx           # Booking confirmed (alternate)
│   ├── portal/
│   │   └── page.tsx               # Learner portal dashboard
│   ├── contact/
│   │   └── page.tsx               # Contact us
│   └── globals.css                # Global styles + Tailwind
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── ui/                        # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Accordion.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── RatingStars.tsx
│   │   └── StepIndicator.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx               # Hero banner with CTA
│   │   ├── StatsSection.tsx       # "Join 50k+ Workers" stats row
│   │   ├── PopularCourses.tsx     # 3–4 featured course cards
│   │   ├── Testimonials.tsx       # Customer quote carousel
│   │   ├── WhyChooseUs.tsx        # "Fast Track | Expert Support | Cert Recognised"
│   │   └── NewsletterBanner.tsx   # Email signup
│   │
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseFilters.tsx       # Category checkboxes, level filter, sort dropdown
│   │   ├── CourseGrid.tsx          # Paginated course grid
│   │   ├── CourseSyllabus.tsx      # Expandable syllabus sections
│   │   ├── CourseDates.tsx         # Upcoming dates table
│   │   ├── RelatedCourses.tsx      # "People also booked" row
│   │   └── CourseEnquiryForm.tsx   # "Enquire Now" form
│   │
│   ├── nvqs/
│   │   ├── QualificationCard.tsx
│   │   ├── QualificationCategories.tsx
│   │   ├── QualificationLevelFilter.tsx
│   │   └── NVQConsultationForm.tsx
│   │
│   ├── cscs/
│   │   ├── CSCSPackageCard.tsx    # Tiered packages (Self-Paced / Tutor-Led / Full Package)
│   │   ├── CSCSHowItWorks.tsx     # 6-step visual timeline
│   │   ├── CSCSCardFinder.tsx     # "Find Your Card Type" interactive widget
│   │   └── CSCSFaqs.tsx
│   │
│   ├── booking/
│   │   ├── BookingProgressBar.tsx  # 5-step progress indicator
│   │   ├── TestTypeCard.tsx        # Radio-select CITB test types
│   │   ├── DateTimePicker.tsx     # Calendar + time slot grid
│   │   ├── CandidateDetailsForm.tsx
│   │   ├── BookingSummary.tsx     # Sidebar with price breakdown
│   │   └── PaymentForm.tsx
│   │
│   ├── checkout/
│   │   ├── CartSummary.tsx        # Line items, remove buttons
│   │   ├── PromoCodeInput.tsx
│   │   ├── DelegateDetailsForm.tsx
│   │   └── PaymentSection.tsx
│   │
│   ├── portal/
│   │   ├── PortalSidebar.tsx      # Navigation: Dashboard, My Courses, Certificates, Bookings, Settings
│   │   ├── PortalHeader.tsx      # Welcome message, avatar, notifications
│   │   ├── ProgressOverview.tsx   # Overall progress ring + stats
│   │   ├── ActiveCourseCard.tsx  # Course card with progress bar, next exam
│   │   ├── CertificateCard.tsx   # Verified certificate display
│   │   └── UpgradeBanner.tsx    # "Upgrade to Level 4" CTA
│   │
│   └── contact/
│       ├── ContactForm.tsx
│       └── OfficeInfo.tsx
│
├── lib/
│   ├── data/
│   │   ├── courses.ts            # Course listings data
│   │   ├── nvqCategories.ts      # NVQ category data
│   │   └── team.ts               # Team member data
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces (Course, NVQ, Booking, User, etc.)
│   └── utils/
│       ├── formatPrice.ts         # Price formatting helper
│       └── cn.ts                  # Class name merger (clsx + tailwind-merge)
│
└── hooks/
    ├── useCart.ts                 # Cart state management
    └── useBookingFlow.ts          # Multi-step booking state
```

---

## 4. Design Tokens

| Token | Value |
|-------|-------|
| Primary Color | `#E63C2F` (red) |
| Secondary Color | `#1A1A1A` (near-black) |
| Accent | `#F5A623` (amber) |
| Background | `#FFFFFF` |
| Surface | `#F9FAFB` |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |
| Border | `#E5E7EB` |
| Success | `#10B981` |
| Error | `#EF4444` |

---

## 5. Key Features Per Page

### Home (`/`)
- Hero with headline "Construction Training That Gets You Site Ready"
- Stats row: Join 50k+ Workers, Fast Track, Expert Support, Certification Recognised
- "Popular Courses" section — 3–4 featured cards with price and CTA
- "ITB Test Booking" quick-access section
- "Explore Our Qualifications" with 4 category cards
- Testimonial quote block
- Newsletter signup in footer

### About Us (`/about`)
- Hero: "Empowering the Construction Industry / Building Careers, One Skill at a Time"
- Mission & Values: Innovation, Integrity, Community
- Team section: 4 members (James Arkwright — Managing Director, Sarah Jenkins — Head of Compliance, Marcus Thorne — Lead NVQ Assessor, Elena Rossi — Student Success Manager)
- Quick links + contact info footer

### Courses (`/courses`)
- Search bar ("Search for courses e.g. SMSTS, NVQ Level 2")
- Filters: Course Category, Qualification Level, CITB Accredited toggle
- Sort: Most Popular, Highest Rated, Price Low-High, Newest
- Grid of CourseCards with pagination
- Sidebar with quick links

### Course Detail (`/courses/[slug]`)
- Breadcrumb navigation
- Course header: title, badge, price, original price, savings tag
- Key info: Duration, Delivery, Next Date, Location
- CITB Grant callout ("Claim £150 back per person")
- Tabs: Overview, Syllabus, Locations & Dates, FAQs
- "People also booked" related courses

### NVQs (`/nvqs`)
- Hero: "Accelerate Your Success with Accredited NVQs"
- Filter bar by qualification area
- 4 category cards: Business & Management, Construction NVQs, Health & Safety NVQs, Health & Social Care
- NVQ consultation/enquiry form (Name, Phone, Qualification Area select)

### CSCS (`/cscs`)
- Hero: "Get Your Green CSCS Card — Fast & Easy" with pricing tiers
- 3 package cards: Online Self-Paced (£99), Online Tutor-Led (£199), Full Package (£99)
- 6-step "How It Works" timeline
- Why Choose TDA Skills block (Lifetime Qualification, Instalments, Fast Certification, Expert Support)
- FAQ accordion
- WhatsApp/phone CTA

### CITB Test Booking (`/citb-test`) — 5-step flow
1. **Test Selection** — Operative Test (£22.50) or Manager & Professional (£22.50) or Specialist variants
2. **Date & Time** — Calendar with available slots
3. **Candidate Details** — Name, DOB, email, phone
4. **Booking Summary** — Review order, add promo code
5. **Payment** — Card details + "Secure Checkout"
- Progress bar at top
- £22.50 test fee + £5.00 (revision materials) included

### Cart/Checkout (`/checkout`)
- Line item with remove option
- Delegate details form
- Promo code input
- "Guaranteed Pass Protection" upsell
- Order summary with subtotal, CITB Registration, VAT, total

### Booking Confirmed (`/booking-confirmed`)
- Large checkmark/confirm icon
- Booking ID (#TDA-88291)
- Course name, date, location
- "What Happens Next?" steps (Check Email, Download Receipt, Upload Card)
- CTA to learner portal

### Learner Portal (`/portal`)
- Sidebar nav: Dashboard, My Courses, Certificates, Bookings, Settings
- Welcome banner: "Welcome back, [Name]"
- Stats row: 3 Active Courses, 08 Certificates, 12 Bookings
- Overall Progress ring (78%)
- Active course cards with progress bar and next exam date
- Latest certificates grid
- "Upgrade to Level 4" banner

### Contact Us (`/contact`)
- Split layout: form left, info right
- Form fields: Full Name, Phone Number, Email Address, Enquiry Type (select), Message
- Office info: address, phone, email, hours
- "Visit Our Hub" with get directions link

---

## 6. Navigation Structure

```
HOME
├── Courses
│   ├── Course Detail → Book Now → Checkout → Confirmed
│   └── All Courses catalog
├── NVQs & Qualifications
│   ├── Business & Management
│   ├── Construction NVQs
│   ├── Health & Safety NVQs
│   └── Health & Social Care
├── CSCS & CPCS
│   └── Book Green Card Package
├── CITB Test
│   ├── Select Test → Date/Time → Details → Summary → Payment → Confirmed
│   └── CITB Test Centres
├── About Us
│   ├── Our History
│   ├── Mission & Values
│   └── The Team
├── Resources
│   ├── Blog / Latest News
│   └── FAQs
├── Contact Us
└── Learner Portal (logged in)
    ├── Dashboard
    ├── My Courses
    ├── Certificates
    ├── Bookings
    └── Settings
```

---

## 7. Responsive Breakpoints

| Name | Value |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

---

## 8. Notes

- The CITB Test booking is a **multi-step form** with client-side step navigation and state persistence (React Context or Zustand)
- The **Learner Portal** is a protected route — requires authentication
- Course and NVQ data should be stored in a **CMS or database** (Prisma + PostgreSQL recommended) but can be seeded from static JSON initially
- The **Cart** state can be managed with React Context + localStorage persistence
- All pages share the **Navbar** and **Footer** via the root layout
- Font stack: system sans-serif (Inter or similar from Google Fonts)
- Use **Tailwind CSS** for styling
- Use **Shadcn/UI** or **Radix UI** for accessible primitive components