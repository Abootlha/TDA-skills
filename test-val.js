const validators = {
    required: (message = "This field is required") => ({
        test: (value) => value ? value.trim() !== "" : false,
        message
    }),
    email: (message = "Please enter a valid email address") => ({
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || ""),
        message
    }),
    password: (message = "Password must be at least 8 characters long") => ({
        test: (value) => value ? value.length >= 8 : false,
        message
    }),
    minLength: (length, message) => ({
        test: (value) => value ? value.trim().length >= length : false,
        message: message || `Must be at least ${length} characters`
    })
};

const validateField = (value, rules) => {
    for (const rule of rules) {
        if (!rule.test(value)) {
            return rule.message;
        }
    }
    return null;
};

const signupSchema = {
  firstName: [validators.required("First name is required"), validators.minLength(3, "Must be at least 3 characters")],
  lastName: [validators.required("Last name is required"), validators.minLength(3, "Must be at least 3 characters")],
  email: [validators.required("Email is required"), validators.email()],
  password: [validators.required("Password is required"), validators.password()]
};

const formData = {
    firstName: "",
    lastName: "",
    email: "mdzaidtalha6393@gmail",
    password: "password123"
};

const errors = {};
Object.keys(signupSchema).forEach(key => {
    const error = validateField(formData[key], signupSchema[key]);
    if (error) errors[key] = error;
});

console.log("Validation Errors:", errors);
