const {check} = require("express-validator");

exports.firsNameValidation = check("firstName")   
.notEmpty()
.withMessage("First name is required")
.trim()
.isLength({min : 2})
.withMessage("First name must be at least 2 ")
.matches(/^[a-zA-Z\s]+$/)
.withMessage("First name can only contain letters")

exports.lastNameValidation = check("lastName")
.notEmpty()
.withMessage("Last name is required")
.trim()
.isLength({min : 2})
.withMessage("Last name must be at least 2 ")
.matches(/^[a-zA-Z\s]+$/)
.withMessage("Last name can only contain letters")

exports.emailValidation = check("email")
.isEmail()
.withMessage("Please enter a valid email")
.normalizeEmail({ gmail_remove_dots: false })

exports.passwordValidation = check("password")
.isLength({min:8, max:32})
.withMessage("Password must be atleast 8 characters long")
.matches(/[a-z]/)
.withMessage("Password must contain at least one lowercase letter")
.matches(/[A-Z]/)
.withMessage("Password must contain at least one uppercase letter")
.matches(/[!@#$%^&*_":?]/)
.withMessage("Password must contain at least one special character")
.trim()

exports.confirm_passwordValidation = check("confirm_password")
.trim()
.custom( (value, { req }) => {
    if (value != req.body.password) {
        throw new Error("Passwords do not match");
    }
    return true;
})

exports.userTypeValidation = check("userType")
.notEmpty()
.withMessage("User type is required")
.isIn(["guest", "host"])
.withMessage("Invalid user type")

exports.termsAcceptedValidation = check("termsAccepted")
.notEmpty()
.withMessage("Use must accept the terms and conditions")
.custom((value) => {
    if (value!= "on"){
        throw new Error("You must accept the terms and conditions");
    }
    return true;
})