import CartController from '../controllers/cart.controller.js';
import express from 'express'
const cartController = new CartController();
const router = express.Router();

router.get("/:cid", cartController.getCart);


export default router;