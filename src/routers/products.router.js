import ProductController from "../controllers/product.controller.js";
import express from 'express'
const productController = new ProductController();
const router = express.Router();

router.get("/", productController.getProducts);
router.post("/", productController.postProducts)


export default router;