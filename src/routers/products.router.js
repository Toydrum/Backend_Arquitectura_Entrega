import ProductController from "../controllers/product.controller.js";
import passport from "passport";
import express from 'express'
const productController = new ProductController();
const router = express.Router();

router.get("/", productController.getProducts);
router.post("/", passport.authenticate("jwt", {session: false}) ,productController.postProducts)


export default router;