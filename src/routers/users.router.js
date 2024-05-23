import UserController from "../controllers/user.controller.js";
import express from 'express';
import passport from "passport";

const userController = new UserController();
const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.logInUser);
router.get("/logout", userController.logOutUser);
router.put("/:uid", userController.updateUser);
router.get("/current", passport.authenticate("jwt", {session: false}), userController.getUserById)
router.post("/requestPasswordReset", userController.requestPasswordReset)
router.post("/reset-password", userController.changePassword);


export default router;