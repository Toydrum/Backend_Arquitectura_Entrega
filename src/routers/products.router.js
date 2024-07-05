import ProductController from "../controllers/product.controller.js";
import passport from "passport";
import express from 'express'
const productController = new ProductController();
const router = express.Router();

router.get("/", passport.authenticate("jwt", {session: false}) , productController.getProducts);
router.get("/:pid", productController.getProductById); 
router.post("/", passport.authenticate("jwt", {session: false}) ,productController.postProducts);
router.delete("/delete/:pid", passport.authenticate("jwt", {session: false}), productController.deleteProduct);


export default router;