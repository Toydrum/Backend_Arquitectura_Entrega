import { EErrors } from "../services/errors/enums.js";
import CustomError from "../services/errors/customError.js";
import generarInfoError from "../services/errors/info.js";

import UserRepository from "../repositories/users.repository.js";
import { cookieExtractor } from "../config/passport.config.js";
import { jwtDecode } from "jwt-decode";

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
			//console.log("user controller", products)
			/* const parsedCart = JSON.parse(JSON.stringify(user.cart).replace(/new Object\(\'/g,''));
			console.log(parsedCart)
			const parsedCartId = parsedCart._id.toString();
			parsedCart._id = parsedCartId
			rUser.cart = parsedCart;
			console.log(parsedCart._id) */
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
}

export default UserController;
