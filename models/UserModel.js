const mongoose = require("mongoose");
const { roles } = require("../utils/enums");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "fullName is required"],
        },
        userName: {
            type: String,
            required: [true, "userName is required"],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
            minlength: [6, "Password Must Contain 6 Letters"],
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(roles),
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        kyc: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },
    },
    {
        timestramps: true,
    }
);

//Encrypting User's Password

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Matching Encrypted User's With User's Entered Password

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;