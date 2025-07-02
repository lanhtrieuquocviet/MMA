const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9_-]{3,16}$/.test(v);
                },
                message: props => `${props.value} is not a valid username! It should be 3-16 characters long and contain only letters, numbers, _ or -.`
            }
        },
        fullname: { type: String, required: [true, 'Fullname is required'] },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        password: { type: String, required: [true, 'Password is required'] },
        isAdmin: { type: Boolean, default: false, required: false },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! It must be exactly 10 digits.`
            }
        },
        address: { type: String, required: true },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = mongoose.model("User", userSchema);
module.exports = User;