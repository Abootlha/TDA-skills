"use client"

import * as React from "react"
import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/Toast"
import { attachUTMData } from "@/lib/utils/utmTracker"
import { validateForm, validateField, validators } from "@/lib/validation"

const contactSchema = {
  fullName: [
    validators.required("Full name is required"),
    validators.name("Please enter a valid name (only letters, spaces, hyphens, and apostrophes)")
  ],
  email: [
    validators.required("Email address is required"),
    validators.email("Please enter a valid email address")
  ],
  phoneNumber: [
    validators.required("Phone number is required"),
    validators.digits("Phone number must contain only numbers")
  ]
}

const ENQUIRY_TYPES = [
  { value: "General Enquiry", label: "General Enquiry" },
  { value: "Course Booking Support", label: "Course Booking Support" },
  { value: "NVQ & Qualifications", label: "NVQ & Qualifications" },
  { value: "CSCS & CPCS Cards", label: "CSCS & CPCS Cards" },
  { value: "CITB Test Booking", label: "CITB Test Booking" },
  { value: "Corporate / Group Booking", label: "Corporate / Group Booking" },
]

export default function ContactPage() {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    enquiryType: "General Enquiry",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        handleReset()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    // Restrict phoneNumber field to digits only
    let updatedValue = value
    if (name === "phoneNumber") {
      updatedValue = value.replace(/[^0-9]/g, "")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }))
    if (errorMessage) setErrorMessage(null)

    // Real-time validation if touched
    if (touched[name]) {
      const rules = contactSchema[name as keyof typeof contactSchema]
      if (rules) {
        const error = validateField(updatedValue, rules)
        setErrors((prev) => ({ ...prev, [name]: error || "" }))
      }
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    const rules = contactSchema[name as keyof typeof contactSchema]
    if (rules) {
      const error = validateField(value, rules)
      setErrors((prev) => ({ ...prev, [name]: error || "" }))
    }
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block any key that is a single character and is not a digit (0-9)
    if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 transition-all text-sm text-[#001430]"
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-500/20 focus:border-red-500`
    }
    return `${baseClass} border-gray-200 focus:ring-[#FFB800]/30 focus:border-[#FFB800]`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Run global validation check
    const allTouched = Object.keys(contactSchema).reduce<Record<string, boolean>>(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    const { isValid, errors: formErrors } = validateForm(formData, contactSchema)
    if (!isValid) {
      setErrors(formErrors)
      const firstError = Object.values(formErrors)[0]
      toast({ type: "error", title: "Validation Error", message: firstError })
      return
    }
    setIsSubmitting(true)
    setErrorMessage(null)

    // Build the request payload and attach UTM tracking data if present
    const payload = attachUTMData({
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone_number: formData.phoneNumber.trim(),
      enquiry_type: formData.enquiryType,
      message: formData.message.trim(),
    })

    const { data, error } = await api.post<any>("/contacts", payload)

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error)
      toast({
        type: "error",
        title: "Submission Failed",
        message: error || "Failed to submit enquiry. Please try again.",
      })
    } else {
      setIsSuccess(true)
      toast({
        type: "success",
        title: "Enquiry Submitted",
        message: "Your message has been sent successfully!",
      })
    }
  }

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      enquiryType: "General Enquiry",
      message: "",
    })
    setIsSuccess(false)
    setErrorMessage(null)
    setErrors({})
    setTouched({})
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-[#001430] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-[#FFB800] uppercase text-xs font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-block mb-4">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
            Get in Touch With Us
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Have questions about training courses, NVQs, CITB tests, or CSCS cards? Our dedicated advisory team is here to support you.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="container mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Connect Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
              <h2 className="text-2xl font-extrabold text-[#001430]">Contact Details</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Connect with our customer service team during office hours for immediate help with booking or certifications.
              </p>

              {/* Call Details */}
              <div className="flex gap-4 items-start border-b border-gray-50 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#001430] shrink-0 shadow-inner">
                  <Phone size={20} className="text-[#002855]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Call Us
                  </span>
                  <a
                    href="tel:02045710045"
                    className="font-bold text-xl text-[#001430] hover:text-[#FFB800] transition-colors"
                  >
                    020 4571 0045
                  </a>
                  <span className="block text-xs text-gray-500 mt-1">Mon-Fri 8am - 6pm</span>
                </div>
              </div>

              {/* Email Details */}
              <div className="flex gap-4 items-start border-b border-gray-50 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#001430] shrink-0 shadow-inner">
                  <Mail size={20} className="text-[#002855]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Email Us
                  </span>
                  <a
                    href="mailto:sales@tdaskills.co.uk"
                    className="font-bold text-lg text-[#001430] hover:text-[#FFB800] transition-colors block"
                  >
                    sales@tdaskills.co.uk
                  </a>
                  <span className="block text-xs text-gray-500 mt-1">Queries handled within 24h</span>
                </div>
              </div>

              {/* Address Details */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#001430] shrink-0 shadow-inner">
                  <MapPin size={20} className="text-[#002855]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Head Office
                  </span>
                  <p className="font-semibold text-gray-700 leading-relaxed">
                    128 City Road, London, <br />
                    United Kingdom, EC1V 2NX
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#002855]">
                  <Clock size={18} />
                </div>
                <h3 className="font-bold text-[#001430] text-lg">Business Hours</h3>
              </div>
              <div className="flex flex-col gap-4 text-sm text-gray-600">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span>Monday - Friday</span>
                  <span className="font-bold text-[#001430]">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span>Saturday</span>
                  <span className="font-bold text-[#001430]">09:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sunday</span>
                  <span className="font-bold text-[#FFB800] bg-[#FFB800]/5 px-2 py-0.5 rounded border border-[#FFB800]/10">
                    CLOSED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form / success container */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            {isSuccess ? (
              /* Success View */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-sm">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-[#001430] mb-3">Enquiry Submitted!</h2>
                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                  Thank you, <span className="font-bold text-gray-800">{formData.fullName}</span>. Your enquiry has been received successfully. One of our course advisors will get in touch with you shortly.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left w-full max-w-md mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Submitted Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {formData.email}</p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {formData.phoneNumber}</p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Type:</span> {formData.enquiryType}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-[#FFB800] text-[#001430] font-bold rounded-xl hover:bg-[#ffb800]/95 hover:shadow-md transition-all flex items-center gap-2 text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#001430] mb-2">Send us a Message</h2>
                  <p className="text-gray-500 text-sm">
                    Please fill out the form below and we will route your enquiry to the appropriate department.
                  </p>
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Submission Error</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-sm font-bold text-[#001430]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. John Doe"
                    disabled={isSubmitting}
                    className={getInputClass("fullName")}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-bold text-[#001430]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. john@example.com"
                      disabled={isSubmitting}
                      className={getInputClass("email")}
                    />
                    {errors.email && touched.email && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phoneNumber" className="text-sm font-bold text-[#001430]">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handlePhoneKeyDown}
                      placeholder="e.g. 07123456789"
                      disabled={isSubmitting}
                      className={getInputClass("phoneNumber")}
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Enquiry Type */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="enquiryType" className="text-sm font-bold text-[#001430]">
                    What is this enquiry about?
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]/30 focus:border-[#FFB800] disabled:bg-gray-50 disabled:text-gray-400 transition-all text-sm text-[#001430]"
                  >
                    {ENQUIRY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-bold text-[#001430]">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your query here (optional)..."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/30 focus:border-[#FFB800] disabled:bg-gray-50 disabled:text-gray-400 transition-all text-sm text-[#001430]"
                  />
                </div>

                <div className="text-xs text-gray-400 leading-relaxed mt-2">
                  By submitting this form, you agree to TDA Skills storing your details for general service tracking, in compliance with our <a href="/privacy" className="underline hover:text-[#001430]">Privacy Policy</a>.
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-[#FFB800] hover:bg-[#ffb800]/95 hover:shadow-lg active:scale-[0.99] text-[#001430] font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-slate-800 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Enquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
