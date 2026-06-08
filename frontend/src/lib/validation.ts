import { isValidPhoneNumber } from 'react-phone-number-input';

export type ValidationRule = {
    test: (value: string) => boolean;
    message: string;
};

export type ValidationSchema = Record<string, ValidationRule[]>;

export const validators = {
    // Field is non-empty (trims whitespace)
    required: (message = "This field is required"): ValidationRule => ({
        test: (value) => value ? value.trim() !== "" : false,
        message
    }),

    // Min character length (trimmed)
    minLength: (length: number, message?: string): ValidationRule => ({
        test: (value) => value ? value.trim().length >= length : false,
        message: message || `Must be at least ${length} characters`
    }),

    // Max character length
    maxLength: (length: number, message?: string): ValidationRule => ({
        test: (value) => value ? value.trim().length <= length : true,
        message: message || `Must be no more than ${length} characters`
    }),

    // Valid email format
    email: (message = "Please enter a valid email address"): ValidationRule => ({
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || ""),
        message
    }),

    // Name: only letters, spaces, hyphens, apostrophes (e.g. "O'Brien", "Mary-Jane")
    name: (message = "Only letters, spaces, hyphens and apostrophes allowed"): ValidationRule => ({
        test: (value) => !value || /^[a-zA-Z\s'\-]+$/.test(value.trim()),
        message
    }),

    // Password: min 8 chars, 1 uppercase, 1 number, 1 special char
    password: (message?: string): ValidationRule => ({
        test: (value) => {
            if (!value || value.length < 8) return false;
            if (!/[A-Z]/.test(value)) return false;
            if (!/[0-9]/.test(value)) return false;
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false;
            return true;
        },
        message: message || "Min 8 chars, 1 uppercase, 1 number, 1 special character"
    }),

    // Basic password — just min length (for login, no strict rules)
    minPassword: (message = "Password must be at least 8 characters"): ValidationRule => ({
        test: (value) => value ? value.length >= 8 : false,
        message
    }),

    // Confirm password — pass a getter fn to read the other field's current value
    confirmPassword: (getPassword: () => string, message = "Passwords do not match"): ValidationRule => ({
        test: (value) => value === getPassword(),
        message
    }),

    // Phone number (uses react-phone-number-input)
    phone: (message = "Please enter a valid phone number"): ValidationRule => ({
        test: (value) => {
            if (!value) return false;
            try {
                return isValidPhoneNumber(value);
            } catch {
                return false;
            }
        },
        message
    }),

    // Date must be parseable
    date: (message = "Please enter a valid date"): ValidationRule => ({
        test: (value) => value ? !isNaN(Date.parse(value)) : false,
        message
    }),

    // Must be in the past (e.g. date of birth)
    pastDate: (message = "Date must be in the past"): ValidationRule => ({
        test: (value) => {
            if (!value) return false;
            const d = Date.parse(value);
            return !isNaN(d) && d < Date.now();
        },
        message
    }),

    // Must be 18+ years old
    minAge: (years: number, message?: string): ValidationRule => ({
        test: (value) => {
            if (!value) return false;
            const dob = new Date(value);
            const cutoff = new Date();
            cutoff.setFullYear(cutoff.getFullYear() - years);
            return dob <= cutoff;
        },
        message: message || `Must be at least ${years} years old`
    }),

    // No whitespace at all (e.g. username)
    noSpaces: (message = "No spaces allowed"): ValidationRule => ({
        test: (value) => !value || !/\s/.test(value),
        message
    }),

    // Must match a regex pattern
    pattern: (regex: RegExp, message: string): ValidationRule => ({
        test: (value) => !value || regex.test(value),
        message
    }),
};

// ---------------------------------------------------------------------------
// Validate a single field value against a list of rules
// Returns the first error message or null if valid
// ---------------------------------------------------------------------------
export const validateField = (value: string, rules: ValidationRule[]): string | null => {
    for (const rule of rules) {
        if (!rule.test(value)) {
            return rule.message;
        }
    }
    return null;
};

// ---------------------------------------------------------------------------
// Validate an entire form object against a schema
// Returns { isValid, errors } — errors only contains failing fields
// ---------------------------------------------------------------------------
export const validateForm = (
    data: Record<string, string>,
    schema: ValidationSchema
): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach(key => {
        const rules = schema[key];
        const value = data[key] || "";

        for (const rule of rules) {
            if (!rule.test(value)) {
                errors[key] = rule.message;
                isValid = false;
                break;
            }
        }
    });

    return { isValid, errors };
};
