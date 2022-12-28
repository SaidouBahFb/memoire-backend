import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Product from "../Models/ProductModel.js";

const productRoute = express.Router()

// GET ALL PRODUCTS
productRoute.get(
    "/",
    asyncHandler(async(req, res) => {
        const pageSize = 6;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: "i",
            },
        } : {};
        const count = await Product.countDocuments({...keyword });
        const products = await Product.find({...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ _id: -1 });
        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    })
);

//ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PAGINATION
productRoute.get(
    "/all",
    protect,
    admin,
    asyncHandler(async(req, res) => {
        const products = await Product.find({}).sort({ _id: -1 });
        res.json(products);
    })
);

// GET SINGLE PRODUCT
productRoute.get(
    "/:id",
    asyncHandler(async(req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404)
            throw new Error("Produit non trouvé");
        }
    })
);

//PRODUCT REVIEW
productRoute.post(
    "/:id/review",
    protect,
    asyncHandler(async(req, res) => {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            )
            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Produit déjà noté")
            }
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };
            product.reviews.push(review)
            product.numReviews = product.reviews.length
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save()
            res.status(201).json({ message: "commentaire ajoutée avec succès" })
        } else {
            res.status(404);
            throw new Error("Produit non trouvé");
        }
    })
);

//DELETE PRODUCT
productRoute.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async(req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.json({ message: "Produit supprimé avec succès" });
        } else {
            res.status(404);
            throw new Error("Produit non trouvé");
        }
    })
);


//CREATE PRODUCT BY ADMIN
productRoute.post(
    "/",
    protect,
    admin,
    asyncHandler(async(req, res) => {
        const { name, price, description, image, countInStock, category } = req.body
        const productExist = await Product.findOne({ name })

        if (productExist) {
            res.status(400);
            throw new Error("Le nom du produit existe déjà");
        } else {
            const product = new Product({
                name,
                price,
                description,
                image,
                countInStock,
                category,
                user: req.user._id,
            });
            if (product) {
                const createdproduct = await product.save();
                res.status(201).json(createdproduct);
            } else {
                res.status(400);
                throw new Error("Données produit non valides");
            }
        }
    })
);

//UPDATE PRODUCT BY ADMIN
productRoute.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async(req, res) => {
        const { name, price, description, image, countInStock, category } = req.body
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error("Produit non trouvé");
        }
    })
);


export default productRoute;