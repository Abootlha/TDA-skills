"use client";

import React, { useState } from "react";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { validateForm, validateField, validators } from "@/lib/validation";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
}

// Login: basic rules only
const loginSchema = {
  email: [validators.required("Email is required"), validators.email()],
  password: [validators.required("Password is required"), validators.minPassword()]
};

export function AuthForm({ initialMode = "login", onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Signup schema built dynamically so confirmPassword can read current password
  const getSignupSchema = () => ({
    firstName: [
      validators.required("First name is required"),
      validators.minLength(2, "Must be at least 2 characters"),
      validators.maxLength(50),
      validators.name()
    ],
    lastName: [], // Optional
    email: [validators.required("Email is required"), validators.email()],
    password: [validators.required("Password is required"), validators.password()],
    confirmPassword: [
      validators.required("Please confirm your password"),
      validators.confirmPassword(() => formData.password)
    ]
  });

  const schema = isLogin ? loginSchema : getSignupSchema();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate in real-time after field has been touched
    if (touched[name]) {
      const currentSchema = isLogin ? loginSchema : getSignupSchema();
      const rules = currentSchema[name as keyof typeof currentSchema];
      if (rules) {
        const error = validateField(value, rules);
        setErrors((prev) => ({ ...prev, [name]: error || "" }));
      }
    }

    // If password changes and confirmPassword has been touched, re-validate confirmPassword too
    if (name === "password" && touched.confirmPassword && !isLogin) {
      const cpError = formData.confirmPassword !== value ? "Passwords do not match" : "";
      setErrors((prev) => ({ ...prev, confirmPassword: cpError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const currentSchema = isLogin ? loginSchema : getSignupSchema();
    const rules = currentSchema[name as keyof typeof currentSchema];
    if (rules) {
      const error = validateField(value, rules);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentSchema = isLogin ? loginSchema : getSignupSchema();

    // Mark all fields as touched
    const allTouched = Object.keys(currentSchema).reduce<Record<string, boolean>>(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const { isValid, errors: formErrors } = validateForm(formData, currentSchema);

    if (isValid) {
      console.log("Form submitted:", formData);
      // TODO: call API
      // On success, trigger the callback
      if (onSuccess) {
          onSuccess();
      }
    } else {
      setErrors(formErrors);
    }
  };

  // Button enabled only when all required fields have a value
  const isFormReady = isLogin
    ? formData.email.trim() !== "" && formData.password.trim() !== ""
    : formData.firstName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "";

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  };

  const fieldClass = (field: string) =>
    `w-full pl-10 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#002855] transition-colors ${
      errors[field] && touched[field] ? "border-red-500 focus:ring-red-400" : "border-gray-200"
    }`;

  const errorMsg = (field: string) =>
    errors[field] && touched[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white w-full max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden relative">
      {/* Left Column: Form */}
      <div className="p-8 md:p-10 md:pr-12">
        <h2 className="text-2xl font-bold text-[#002855] mb-2">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {isLogin ? "Sign in to access your learning portal" : "Join us to start your learning journey"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>

          {/* Name row — signup only */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">First Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John"
                    autoComplete="given-name"
                    className={fieldClass("firstName")}
                  />
                </div>
                {errorMsg("firstName")}
              </div>

              {/* Last Name — Optional */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  Last Name <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={fieldClass("lastName")}
                  />
                </div>
                {errorMsg("lastName")}
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="john@example.com"
                autoComplete="email"
                className={fieldClass("email")}
              />
            </div>
            {errorMsg("email")}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              {isLogin && (
                <a href="#" className="text-xs text-[#002855] hover:underline font-medium">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className={fieldClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errorMsg("password")}
            {/* Password hint for signup */}
            {!isLogin && !errors.password && (
              <p className="text-xs text-gray-400 mt-1">
                Min 8 chars · 1 uppercase · 1 number · 1 special character
              </p>
            )}
          </div>

          {/* Confirm Password — signup only */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={fieldClass("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errorMsg("confirmPassword")}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormReady}
            className={`w-full font-bold py-3 rounded-lg transition-all mt-2 ${
              isFormReady
                ? "bg-[#FFB800] hover:bg-[#e5a600] text-[#002855] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={toggleMode} className="text-[#002855] font-bold hover:underline">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>

      {/* Right Column: OAuth */}
      <div className="p-8 md:p-10 bg-gray-50 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
        <h3 className="text-lg font-bold text-[#002855] mb-6 text-center">Or continue with</h3>

        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <button className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm">
            <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0H0v10h10V0z" fill="#f25022" />
              <path d="M21 0H11v10h10V0z" fill="#7fba00" />
              <path d="M10 11H0v10h10V11z" fill="#00a4ef" />
              <path d="M21 11H11v10h10V11z" fill="#ffb900" />
            </svg>
            Microsoft
          </button>

          <button className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm">
            <svg viewBox="0 0 384 512" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-50.6-22.1-79.5-21.5-44.7.7-86.3 26-109.1 66.8-46.7 82.8-12.2 205.8 33.3 271.8 22.3 32.2 48.9 68.3 84.1 67.1 33.8-1.1 47.1-21.9 87.7-21.9 40.5 0 52.6 22 88.1 21.2 36.4-.7 59-33.1 81.2-65.7 25.8-38 36.6-74.9 37.3-76.8-1.2-.5-95.2-36.8-95-134.3zM258.9 76.5c20.3-24.8 33.9-59.2 30.2-93.5-30.2 1.3-66.2 20.3-87.1 45.4-18.3 21.6-34 56.6-29.6 90.1 33.9 2.6 66.4-17.2 86.5-42z" />
            </svg>
            Apple
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 max-w-xs mx-auto">
          By continuing, you agree to TDA Skills' Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
