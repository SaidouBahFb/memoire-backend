import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Entrer le nom du produit !"],
        minlength: [2, "Veuillez saisir un nom d'au moins 2 caractères"],
    },
    image: {
        type: String,
        required: [true, "Entrer l'image du produit !"],
    },
    description: {
        type: String,
        required: [true, "Entrer la description du produit !"]
    },
    category: {
        type: String,
        required: [true, "Entrer la categorie du produit !"],
    },
    reviews: [ReviewSchema],
    rating: {
        type: Number,
        required: [true, "Entrer la note du produit !"],
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "Entrer le prix du produit !"],
        default: 0
    },
    countInStock: {
        type: Number,
        required: [true, "Entrer la quantité en stock du produit !"],
        default: 0,
    },

}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;