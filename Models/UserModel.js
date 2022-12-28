import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Entrer votre nom !"],
        minlength: [2, "Veuillez saisir un nom d'au moins 2 caractères"],
        maxlength: [30, "Le nom ne peut pas dépasser 30 caractères"],
    },
    email: {
        type: String,
        required: [true, "Entrer votre e-mail !"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Entrer votre mot de passe !"],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

//login
userSchema.methods.matchPassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

//Register
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;