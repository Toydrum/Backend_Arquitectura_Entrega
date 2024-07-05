import { EErrors } from "../services/errors/enums.js";
import CustomError from "../services/errors/customError.js";
import generarInfoError from "../services/errors/info.js";
import tokenCreator from "../utils/tokenCreator.js";
import EmailManager from "../services/emailManager.js";
import UserRepository from "../repositories/users.repository.js";
import { cookieExtractor } from "../config/passport.config.js";
import { jwtDecode } from "jwt-decode";
import UserModel from "../models/user.model.js";
import { get } from "mongoose";
import { th } from "@faker-js/faker";

const userRepository = new UserRepository();

class UserController {
	async createUser(req, res) {
		const { firstname, lastname, email, password, age } = req.body;
		try {
			const newUser = await userRepository.createUser(
				firstname,
				lastname,
				email,
				password,
				age
			);
			if (!newUser) {
				console.log("el usuario ya existe");
				res.send({ message: "el usuario ya existe" });
			} else {
				res.status(200);
				res.cookie("coderCookieToken", newUser, { httpOnly: true });
				res.redirect(`/users/current`);
			}
		} catch (error) {
			res.status(500).send("Error al crear usuario");
		}
	}

	async getAllUsers(req, res) {
		try {
			const allUsersF = await userRepository.getUsers();
			const allUsers = allUsersF.map((u) => {
				const { _v, ...rest } = u.toObject();
				console.log(rest)
				return rest;
			});
			res.status(200)
			res.render("users", { users: allUsers }); 
		} catch (error) {
			
		}
	}

	async getUserById(req, res) {
		try {
			const token = cookieExtractor(req);
			const payload = jwtDecode(token);
			const id = payload._id;
			//console.log(payload);
			//console.log(id);
			let user = await userRepository.getUserById(id);

			if (!user) {
				throw new Error("no se encontró el usuario");
			}

			let rUser = {
				_id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.lastname,
				password: user.password,
				rol: user.rol,
				age: user.age,
				cart: [user.cart].map((c) => {
					const { _v, ...rest } = c.toObject();
					//console.log(rest)
					return rest;
				})[0],
			};

			if (user.rol === "user") {
				rUser = { ...rUser, credential: true };
			}

			if (user.rol === "admin") {
				rUser = { ...rUser, credential2: true };
			}

			const products = user.cart?.products
				? user.cart.products.map((u) => {
						const { _v, ...rest } = u.product.toObject();
						//console.log(rest)
						return rest;
				})
				: null;
		
			res.status(200);
			res.render("current", {
				user: rUser,
				cartProducts: products,
			});
		} catch (error) {
			console.error(error);
			res.status(500).send("Error al buscar usuario");
		}
	}

	async logInUser(req, res, next) {
		try {
			const { email, password } = req.body;

			const currentUser = await userRepository.logInUser({ email, password });
			//console.log("login user controller",currentUser)
			if (currentUser) {
				res.status(200);
				res.cookie("coderCookieToken", currentUser, { httpOnly: true });
				//res.render("current")
				res.redirect("/users/current");
			} else {
				throw CustomError.createError({
					name: "error",
					cause: generarInfoError({ email, password }),
					message: "error al intentar hacer login",
					code: EErrors.TYPE_INVALID,
				});
			}
		} catch (error) {
			next(error);
		}
	}

	async updateUser(req, res) {
		const updatedUser = req.body;
		const id = req.params.uid;
		console.log(updatedUser);
		try {
			const user = await userRepository.updateUserById(updatedUser, id);
			res.status(200).json(user);
		} catch (error) {
			res.status(500).send("Error al actualizar usuario");
		}
	}

	async requestPasswordReset(req, res) {
		const { email } = req.body;
		try {
			const user = await UserModel.findOne({email})
			if(!user){
				return res.status(404).send("User not found")
			}
			const token = tokenCreator();
			user.resetToken = {
				token: token,
				expire: new Date(Date.now() + 3600000)
			}
			const emailManager = new EmailManager();
			
			await emailManager.restEmail(email, user.firstname, token);

			await user.save();

			res.redirect("/views/confirmation");

		} catch (error) {
			console.error(error);
			res.status(500).send("Error al solicitar cambio de contraseña");

		}
	}

	async changePassword(req, res){
		try {
			const {email, password, token} = req.body;
			if(token.expire < Date.now()){
				res.redirect("/views/reset-password");
			}
			const user = await userRepository.changePassword(email, password, token);
			if(!user){
				return res.status(404).send("User not found")
			}
			res.redirect("/views/login");


		} catch (error) {
			console.error(error);
			res.status(500).send("Error al cambiar contraseña");
		}
	}

	async changeRollPremium(req, res) {
		try {
			const {uid} = req.params;
			const user = await UserModel.findById(uid)
			if(!user) {
				return res.status(404).send("User not found")
			}

			const newRoll = user.role === "user"? "premium" : "user"

			const actualized = await UserModel.findByIdAndUpdate(uid, {rol: newRoll})

			return actualized;

		} catch (error) {
			
		}
	}

	async logOutUser(req, res) {
		res.clearCookie("coderCookieToken");
		res.redirect("/views/login");
	}

	async renderMasterView(req, res) {
		try {
			const getUsers = await userRepository.getUsers();
			const users = getUsers.map((u) => {
				const { _v, ...rest } = u.toObject();
				//console.log(rest)
				return rest;
			});
			res.render("masterView", { users: users });
		} catch (error) {
			throw new Error("Error al renderizar la vista");
		}
	}

	async deleteUser(req, res) {
		try {
			const {uid} = req.params;
			
			const user = await userRepository.getUserById(uid);

			if(!user){
				return res.status(404).send("User not found")
			}
			const emailManager = new EmailManager();
			await emailManager.sendEmail(user.email, user.firstname+user.lastname, "Esperamos verte pronto");
			const deletedUser = await userRepository.deleteUserById(uid);
			res.status(200).send(deletedUser); 
			return deletedUser;
		} catch (error) {
			console.log(error);
			throw new Error("Error al borrar usuario");
		}
	}
}
export default UserController;
