import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { validators, validateForm, validateField } from "../../lib/validation";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from "axios";

interface DelegateDetailsStepProps {
    onNext: () => void;
    onBack: () => void;
}

const validationSchema = {
    firstName: [validators.required("First name is required")],
    lastName: [], // Optional
    email: [validators.required("Email address is required"), validators.email("Please enter a valid email address")],
    phone: [validators.required("Phone number is required"), validators.phone("Please enter a valid phone number")],
    dob: [validators.required("Date of birth is required")]
};

export function DelegateDetailsStep({ onNext, onBack }: DelegateDetailsStepProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [sessionId, setSessionId] = useState<string>("");

    // Load draft on mount
    useEffect(() => {
        let id = localStorage.getItem("tda_checkout_session");
        if (!id) {
            id = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem("tda_checkout_session", id);
        }
        setSessionId(id);

        // Instant display from local storage fallback
        const localDraft = localStorage.getItem("tda_checkout_draft");
        if (localDraft) {
            try {
                const parsed = JSON.parse(localDraft);
                if (parsed) {
                    setFormData(prev => ({
                        firstName: parsed.firstName || prev.firstName || "",
                        lastName: parsed.lastName || prev.lastName || "",
                        email: parsed.email || prev.email || "",
                        phone: parsed.phone || prev.phone || "",
                        dob: parsed.dob || prev.dob || ""
                    }));
                }
            } catch (e) {
                console.error("Failed to parse local draft", e);
            }
        }

        axios.get("http://localhost:8080/api/v1/checkout/draft", {
            headers: { "X-Session-ID": id }
        })
        .then(res => {
            if (res.data && res.data.draft) {
                const draft = res.data.draft;
                setFormData(prev => ({
                    firstName: draft.firstName || prev.firstName || "",
                    lastName: draft.lastName || prev.lastName || "",
                    email: draft.email || prev.email || "",
                    phone: draft.phone || prev.phone || "",
                    dob: draft.dob || prev.dob || ""
                }));
                localStorage.setItem("tda_checkout_draft", JSON.stringify(draft));
            }
        })
        .catch(err => console.error("Failed to load draft:", err));
    }, []);

    // Save draft on formData change (debounced)
    useEffect(() => {
        if (!sessionId) return;

        // Skip saving empty form
        if (!formData.firstName && !formData.lastName && !formData.email && !formData.phone && !formData.dob) {
            return;
        }

        const timer = setTimeout(() => {
            // Save to local storage as fallback
            localStorage.setItem("tda_checkout_draft", JSON.stringify(formData));

            axios.post("http://localhost:8080/api/v1/checkout/draft", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-ID": sessionId
                }
            }).catch(err => console.error("Failed to save draft:", err));
        }, 1000);

        return () => clearTimeout(timer);
    }, [formData, sessionId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error as user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handlePhoneChange = (value?: string) => {
        setFormData({ ...formData, phone: value || "" });
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: "" }));
        }
    };

    const handlePhoneBlur = () => {
        setTouched({ ...touched, phone: true });
        const error = validateField(formData.phone, validationSchema.phone);
        if (error) {
            setErrors(prev => ({ ...prev, phone: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });

        const error = validateField(value, validationSchema[name as keyof typeof validationSchema]);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleNext = () => {
        // Mark all as touched
        const allTouched = Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        const { isValid, errors: formErrors } = validateForm(formData, validationSchema);

        if (isValid) {
            onNext();
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">

                <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                    <h2 className="font-sans font-bold text-[28px] text-[#001430]">
                        Delegate Details
                    </h2>
                    <span className="text-sm font-bold text-gray-500">Delegate 1 of 1</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-[8px] border focus:outline-none focus:ring-2 focus:ring-[#001430] ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.firstName && touched.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-[8px] border focus:outline-none focus:ring-2 focus:ring-[#001430] ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.lastName && touched.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-[8px] border focus:outline-none focus:ring-2 focus:ring-[#001430] ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.email && touched.email ? (
                            <span className="text-xs text-red-500">{errors.email}</span>
                        ) : (
                            <p className="text-[12px] text-gray-500 mt-1">Certification details will be sent to this email.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                        <PhoneInput
                            international
                            defaultCountry="GB"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
                            className={`w-full px-4 py-3 rounded-[8px] border bg-white focus-within:ring-2 focus-within:ring-[#001430] ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.phone && touched.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-[8px] border focus:outline-none focus:ring-2 focus:ring-[#001430] ${errors.dob && touched.dob ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.dob && touched.dob && <span className="text-xs text-red-500">{errors.dob}</span>}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={onBack}
                        className="text-[#001430] font-bold text-sm hover:underline"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="bg-[#ffbb16] text-[#001430] hover:bg-[#e5a813] px-8 py-4 rounded-[8px] font-bold flex items-center gap-2 transition-colors"
                    >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
                {/* Mock Payment Method Icons */}
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
