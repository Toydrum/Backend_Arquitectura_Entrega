import UserController from "../controllers/user.controller.js";
import express from 'express';
const userController = new UserController();
const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.logInUser);
router.put("/:uid", userController.updateUser);


export default router;