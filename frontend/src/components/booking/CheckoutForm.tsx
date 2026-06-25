'use client';

import { useState, useEffect } from "react";
import { ArrowRight, User, MapPin, Building2, Check, Copy } from "lucide-react";
import { validators, validateForm, validateField } from "../../lib/validation";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { api } from "../../lib/api";
import { useCartStore } from "../../lib/store/cartStore";
import { attachUTMData } from "@/lib/utils/utmTracker";
import { useToast } from "@/components/ui/Toast";
import { PayPalCheckoutButton } from "./PayPalCheckoutButton";

interface CheckoutFormProps {
    onSuccess: (orderId: string) => void;
    onBack: () => void;
}

export function CheckoutForm({ onSuccess, onBack }: CheckoutFormProps) {
    const { items, checkoutFormData, setCheckoutFormData } = useCartStore();
    const { toast } = useToast();

    const [formData, setFormData] = useState(checkoutFormData || {
        isCompany: false,
        companyName: "",
        companyReg: "",
        companyAddress: "",
        companyVat: "",
        payerFirstName: "",
        payerLastName: "",
        payerEmail: "",
        payerPhone: "",
        payerAddress: "",
        payerCounty: "",
        payerPostalCode: "",
        payerCountry: "United Kingdom",
        sameAsPayer: false,
        candidateFirstName: "",
        candidateLastName: "",
        candidateEmail: "",
        candidatePhone: "",
        candidateDob: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

    const validationSchema = {
        payerFirstName: [validators.required("First name is required")],
        payerLastName: [validators.required("Last name is required")],
        payerEmail: [validators.required("Email is required"), validators.email("Invalid email")],
        payerPhone: [validators.required("Phone number is required"), validators.phone("Invalid phone number")],
        payerAddress: [validators.required("Address is required")],
        payerCounty: [validators.required("County is required")],
        payerPostalCode: [validators.required("Postal code is required")],
        payerCountry: [validators.required("Country is required")],

        ...(formData.isCompany ? {
            companyName: [validators.required("Company name is required")],
            companyAddress: [validators.required("Company address is required")],
        } : {}),

        ...(!formData.sameAsPayer ? {
            candidateFirstName: [validators.required("First name is required")],
            candidateLastName: [validators.required("Last name is required")],
            candidateEmail: [validators.required("Email is required"), validators.email("Invalid email")],
            candidatePhone: [validators.required("Phone number is required"), validators.phone("Invalid phone number")],
        } : {}),
        candidateDob: [validators.required("Date of birth is required")]
    };

    const updateForm = (updates: Partial<typeof formData>) => {
        const newData = { ...formData, ...updates };
        setFormData(newData);
        setCheckoutFormData(newData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        updateForm({ [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handlePhoneChange = (field: 'payerPhone' | 'candidatePhone', value?: string) => {
        updateForm({ [field]: value || "" });
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(value, (validationSchema as any)[name]);
        if (error) setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleCreateBooking = async () => {
        const allTouched = Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        const { isValid, errors: formErrors } = validateForm(formData, validationSchema);
        if (!isValid) {
            setErrors(formErrors);
            toast({ message: "Please fill all required fields correctly.", type: "error" });
            return;
        }

        if (items.length === 0) {
            toast({ message: "Your cart is empty. Please add a test or course first.", type: "error" });
            return;
        }

        setIsSubmitting(true);

        const personalDetails = {
            payer: {
                firstName: formData.payerFirstName,
                lastName: formData.payerLastName,
                email: formData.payerEmail,
                phone: formData.payerPhone,
                address: formData.payerAddress,
                county: formData.payerCounty,
                postalCode: formData.payerPostalCode,
                country: formData.payerCountry
            },
            candidate: {
                firstName: formData.sameAsPayer ? formData.payerFirstName : formData.candidateFirstName,
                lastName: formData.sameAsPayer ? formData.payerLastName : formData.candidateLastName,
                email: formData.sameAsPayer ? formData.payerEmail : formData.candidateEmail,
                phone: formData.sameAsPayer ? formData.payerPhone : formData.candidatePhone,
                dob: formData.candidateDob
            }
        };

        const companyDetails = formData.isCompany ? {
            companyName: formData.companyName,
            companyReg: formData.companyReg,
            companyAddress: formData.companyAddress,
            companyVat: formData.companyVat
        } : null;

        const typeMap: Record<string, string> = { test: "citb-test", course: "course", nvq: "nvq" };
        const bookingType = typeMap[items[0]?.type || ""] || "citb-test";

        const { data, error } = await api.post<{ id: string }>('/bookings', attachUTMData({
            booking_type: bookingType,
            personal_details: personalDetails,
            company_details: companyDetails,
            items: items.map(item => ({
                course_id: item.id,
                description: item.title,
                unit_price: item.price,
                quantity: 1
            }))
        }));

        setIsSubmitting(false);

        if (error || !data?.id) {
            toast({ message: error || "Failed to create booking. Please try again.", type: "error" });
            return;
        }

        setCreatedBookingId(data.id);
        toast({ message: "Details confirmed! Please complete payment below.", type: "success" });
    };

    const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

    // Reusable input class for premium TDA look
    const inputClassName = (error?: string, touched?: boolean) =>
        `w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-[#f8f9fa] focus:bg-white focus:outline-none ${error && touched
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-transparent focus:border-[#001430] focus:ring-4 focus:ring-[#001430]/10 hover:border-gray-200'
        }`;

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Company Toggle & Info */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#001430] to-[#ffbb16]"></div>

                <div className="flex items-center justify-between gap-4 bg-[#f8f9fa] p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-50">
                            <Building2 className="w-6 h-6 text-[#001430]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#001430] text-lg">Purchasing as a Company?</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Enable this if you are booking on behalf of an organization.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input type="checkbox" name="isCompany" className="sr-only peer" checked={formData.isCompany} onChange={handleChange} disabled={!!createdBookingId} />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001430]"></div>
                    </label>
                </div>

                {formData.isCompany && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-[#001430]">Company Name *</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.companyName, touched.companyName)} placeholder="e.g. Acme Corp Ltd" />
                            {errors.companyName && touched.companyName && <span className="text-xs text-red-500 font-medium">{errors.companyName}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-[#001430]">Registration Number</label>
                            <input type="text" name="companyReg" value={formData.companyReg} onChange={handleChange} disabled={!!createdBookingId} className={inputClassName()} placeholder="e.g. 12345678" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-[#001430]">Company Address *</label>
                            <textarea name="companyAddress" rows={2} value={formData.companyAddress} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={`${inputClassName(errors.companyAddress, touched.companyAddress)} resize-none`} placeholder="Full company registered address" />
                            {errors.companyAddress && touched.companyAddress && <span className="text-xs text-red-500 font-medium">{errors.companyAddress}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-[#001430]">VAT Number</label>
                            <input type="text" name="companyVat" value={formData.companyVat} onChange={handleChange} disabled={!!createdBookingId} className={inputClassName()} placeholder="e.g. GB123456789" />
                        </div>
                    </div>
                )}
            </div>

            {/* Payer Information */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
                <div className="flex items-center gap-3 border-l-4 border-[#ffbb16] pl-4 mb-2">
                    <h2 className="font-sans font-bold text-[22px] text-[#001430]">
                        Payer Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">First Name *</label>
                        <input type="text" name="payerFirstName" value={formData.payerFirstName} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerFirstName, touched.payerFirstName)} />
                        {errors.payerFirstName && touched.payerFirstName && <span className="text-xs text-red-500 font-medium">{errors.payerFirstName}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Last Name *</label>
                        <input type="text" name="payerLastName" value={formData.payerLastName} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerLastName, touched.payerLastName)} />
                        {errors.payerLastName && touched.payerLastName && <span className="text-xs text-red-500 font-medium">{errors.payerLastName}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Email Address *</label>
                        <input type="email" name="payerEmail" value={formData.payerEmail} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerEmail, touched.payerEmail)} placeholder="receipts@example.com" />
                        {errors.payerEmail && touched.payerEmail && <span className="text-xs text-red-500 font-medium">{errors.payerEmail}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Phone Number *</label>
                        <PhoneInput international defaultCountry="GB" value={formData.payerPhone} onChange={(val) => handlePhoneChange('payerPhone', val)} onBlur={() => handleBlur({ target: { name: 'payerPhone', value: formData.payerPhone } } as any)} disabled={!!createdBookingId} className={`tda-phone-input ${inputClassName(errors.payerPhone, touched.payerPhone)} !p-0`} />
                        {errors.payerPhone && touched.payerPhone && <span className="text-xs text-red-500 font-medium">{errors.payerPhone}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-bold text-[#001430]">Billing Address *</label>
                        <input type="text" name="payerAddress" value={formData.payerAddress} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerAddress, touched.payerAddress)} placeholder="Street address" />
                        {errors.payerAddress && touched.payerAddress && <span className="text-xs text-red-500 font-medium">{errors.payerAddress}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">County / State *</label>
                        <input type="text" name="payerCounty" value={formData.payerCounty} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerCounty, touched.payerCounty)} />
                        {errors.payerCounty && touched.payerCounty && <span className="text-xs text-red-500 font-medium">{errors.payerCounty}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Postal Code *</label>
                        <input type="text" name="payerPostalCode" value={formData.payerPostalCode} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerPostalCode, touched.payerPostalCode)} />
                        {errors.payerPostalCode && touched.payerPostalCode && <span className="text-xs text-red-500 font-medium">{errors.payerPostalCode}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-bold text-[#001430]">Country *</label>
                        <select name="payerCountry" value={formData.payerCountry} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.payerCountry, touched.payerCountry)}>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Ireland">Ireland</option>
                            <option value="United States">United States</option>
                            <option value="India">India</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                        </select>
                        {errors.payerCountry && touched.payerCountry && <span className="text-xs text-red-500 font-medium">{errors.payerCountry}</span>}
                    </div>
                </div>
            </div>

            {/* Candidate Information */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 border-l-4 border-[#ffbb16] pl-4">
                        <h2 className="font-sans font-bold text-[22px] text-[#001430]">
                            Candidate Details
                        </h2>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer bg-[#f8f9fa] px-4 py-2.5 rounded-xl border border-gray-200 hover:border-[#001430]/30 hover:bg-gray-50 transition-all group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${formData.sameAsPayer ? 'bg-[#001430] border-[#001430]' : 'bg-white border-gray-300 group-hover:border-[#001430]/50'}`}>
                            {formData.sameAsPayer && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            name="sameAsPayer"
                            checked={formData.sameAsPayer}
                            onChange={handleChange}
                            disabled={!!createdBookingId}
                            className="hidden"
                        />
                        <span className="text-sm font-bold text-[#001430]">Same as payer details</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">First Name *</label>
                        <input type="text" name="candidateFirstName" value={formData.sameAsPayer ? formData.payerFirstName : formData.candidateFirstName} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId || formData.sameAsPayer} className={`${inputClassName(errors.candidateFirstName && !formData.sameAsPayer ? errors.candidateFirstName : undefined, touched.candidateFirstName)} ${formData.sameAsPayer ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`} />
                        {errors.candidateFirstName && touched.candidateFirstName && !formData.sameAsPayer && <span className="text-xs text-red-500 font-medium">{errors.candidateFirstName}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Last Name *</label>
                        <input type="text" name="candidateLastName" value={formData.sameAsPayer ? formData.payerLastName : formData.candidateLastName} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId || formData.sameAsPayer} className={`${inputClassName(errors.candidateLastName && !formData.sameAsPayer ? errors.candidateLastName : undefined, touched.candidateLastName)} ${formData.sameAsPayer ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`} />
                        {errors.candidateLastName && touched.candidateLastName && !formData.sameAsPayer && <span className="text-xs text-red-500 font-medium">{errors.candidateLastName}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Email Address *</label>
                        <input type="email" name="candidateEmail" value={formData.sameAsPayer ? formData.payerEmail : formData.candidateEmail} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId || formData.sameAsPayer} className={`${inputClassName(errors.candidateEmail && !formData.sameAsPayer ? errors.candidateEmail : undefined, touched.candidateEmail)} ${formData.sameAsPayer ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`} />
                        {errors.candidateEmail && touched.candidateEmail && !formData.sameAsPayer && <span className="text-xs text-red-500 font-medium">{errors.candidateEmail}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#001430]">Phone Number *</label>
                        <PhoneInput international defaultCountry="GB" value={formData.sameAsPayer ? formData.payerPhone : formData.candidatePhone} onChange={(val) => handlePhoneChange('candidatePhone', val)} onBlur={() => handleBlur({ target: { name: 'candidatePhone', value: formData.candidatePhone } } as any)} disabled={!!createdBookingId || formData.sameAsPayer} className={`tda-phone-input ${inputClassName(errors.candidatePhone && !formData.sameAsPayer ? errors.candidatePhone : undefined, touched.candidatePhone)} !p-0 ${formData.sameAsPayer ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`} />
                        {errors.candidatePhone && touched.candidatePhone && !formData.sameAsPayer && <span className="text-xs text-red-500 font-medium">{errors.candidatePhone}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-bold text-[#001430]">Date of Birth *</label>
                        <input type="date" name="candidateDob" value={formData.candidateDob} onChange={handleChange} onBlur={handleBlur} disabled={!!createdBookingId} className={inputClassName(errors.candidateDob, touched.candidateDob)} />
                        {errors.candidateDob && touched.candidateDob && <span className="text-xs text-red-500 font-medium">{errors.candidateDob}</span>}
                    </div>
                </div>

                {!createdBookingId ? (
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0 mt-8 pt-8 border-t border-gray-100">
                        <button onClick={onBack} className="text-[#001430] font-bold text-sm hover:underline px-4 py-2 w-full md:w-auto text-center">
                            Return to Cart
                        </button>
                        <button onClick={handleCreateBooking} disabled={isSubmitting} className="w-full md:w-auto bg-[#ffbb16] text-[#001430] hover:bg-[#f2b012] px-6 md:px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#ffbb16]/20 disabled:opacity-50 disabled:transform-none disabled:shadow-none text-base md:text-lg">
                            {isSubmitting ? "Processing..." : "Confirm & Proceed to Pay"}
                            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-6 text-center border border-gray-100">
                            <h3 className="font-bold text-[#001430] text-xl mb-2">Details Confirmed!</h3>
                            <p className="text-gray-600 text-sm">Please complete your secure payment below to finalize your booking.</p>
                        </div>
                        <div className="max-w-md mx-auto">
                            <PayPalCheckoutButton
                                bookingID={createdBookingId}
                                amount={totalAmount}
                                onSuccess={(orderID) => onSuccess(orderID)}
                                onError={(err) => console.error("Payment failed", err)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Custom styles for the PhoneInput inner elements to match our premium look */}
            <style jsx global>{`
                .tda-phone-input {
                    display: flex !important;
                    align-items: center !important;
                    padding: 0 !important;
                }
                .tda-phone-input .PhoneInputCountry {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding-left: 1rem;
                    margin-right: 0.5rem;
                }
                .tda-phone-input .PhoneInputCountrySelect {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 1;
                    border: 0;
                    opacity: 0;
                    cursor: pointer;
                }
                .tda-phone-input .PhoneInputCountryIcon {
                    width: 28px !important;
                    height: 20px !important;
                    min-width: 28px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .tda-phone-input .PhoneInputCountryIconImg {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover;
                }
                .tda-phone-input .PhoneInputCountrySelectArrow {
                    display: block;
                    content: "";
                    width: 0.3em;
                    height: 0.3em;
                    margin-left: 0.5em;
                    border-style: solid;
                    border-color: currentColor;
                    border-top-width: 0;
                    border-bottom-width: 1px;
                    border-left-width: 0;
                    border-right-width: 1px;
                    transform: rotate(45deg);
                    opacity: 0.45;
                }
                .tda-phone-input .PhoneInputInput {
                    flex: 1;
                    min-width: 0;
                    border: none;
                    background: transparent;
                    padding: 0.875rem 1rem 0.875rem 0.5rem;
                    outline: none;
                    font-size: 1rem;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
