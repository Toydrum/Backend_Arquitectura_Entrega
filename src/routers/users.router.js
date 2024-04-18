import UserController from "../controllers/user.controller.js";
import express from 'express';
const userController = new UserController();
const router = express.Router();

router.post("/", userController.createUser);


export default router;