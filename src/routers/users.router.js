import UserController from "../controllers/user.controller.js";
import express from 'express';
import passport from "passport";
import verificarRol from "../middleware/guard.js";

const userController = new UserController();
const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.logInUser);
router.get("/logout", userController.logOutUser);
router.put("/:uid", userController.updateUser);
router.get("/", userController.getAllUsers);
router.get("/masterview", verificarRol(['admin']) ,userController.renderMasterView);
router.get("/current", passport.authenticate("jwt", {session: false}), userController.getUserById);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.changePassword);
router.delete("/delete/:uid", userController.deleteUser);


export default router;