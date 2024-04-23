import CartController from '../controllers/cart.controller.js';
import express from 'express'
const cartController = new CartController();
const router = express.Router();

router.get("/:cid", cartController.getCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
router.delete("/:cid", cartController.deleteCart);
router.put("/:cid", cartController.updateProductsFromCart);
router.put("/:cid/product/:pid", cartController.updateProductAmountInCart);
router.post("/:cid/purchase/:uid", cartController.purchaseItem);

export default router;