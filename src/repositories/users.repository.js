import UserModel from "../models/user.model.js";
import CartsRepository from "./carts.repository.js";

import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
const cartsRepository = new CartsRepository();

class UserRepository {
	async createUser(firstname, lastname, email, password, age) {
		try {
			if (!firstname || !lastname || !email || !password || !age) {
				console.log("todos los campos son requeridos");
				return;
			}
			const users = await this.getUsers();
			const userExists = users.find((item) => item.email === email);

			if (userExists) {
				return false;
			}

			let rol = "user";
			if (email.endsWith("admin.com")) {
				rol = "admin";
			} else if (email.endsWith("premium.com")) {
				rol = "premium";
			}

			const cart = await cartsRepository.createCart();
			if (!cart) {
				throw new Error("no se creo carrito");
			}
			const user = new UserModel({
				firstname,
				lastname,
				email,
				password: createHash(password),
				age,
				cart: cart._id,
				rol,
			});

			//console.log(user);

			await user.save();
			const token = jwt.sign({ ...user._doc }, "coderhouse");
			return token;
		} catch (error) {
			console.log("error con mongo", error);
		}
	}

	async logInUser(Obj) {
		const { email, password } = Obj;
		try {
			const users = await this.getUsers();
			const currentUser = users.find((item) => item.email === email);
			if (!currentUser) {
				console.log("user not found");
			}
			if (isValidPassword(password, currentUser)) {
				const token = jwt.sign({ ...currentUser._doc }, "coderhouse");
				return token;
			}
			return null;
		} catch (error) {
			console.error("error al hacer login", error);
		}
	}

	async getUsers() {
		try {
			const user = await UserModel.find();
			return user;
		} catch (error) {
			console.log("Error getting users", error);
		}
	}

	async updateUserById(updatedUser, id) {
		try {
			let user = await UserModel.findByIdAndUpdate(id, updatedUser);
			//console.log(user);
			await user.save();
			return user;
		} catch (error) {}
	}

	async getUserById(id) {
		try {
			const user = await UserModel.findById(id);
			if (!user) {
				throw new Error("no user found");
			}
			return user;
		} catch (error) {
			console.log("Error getting users", error);
		}
	}

	async changePassword(email, password, token) {
		try {
			const user = await UserModel.findOne({ email });
			if (!user) {
				throw new Error("no user found");
			}

			if (user.resetToken.token !== token) {
				throw new Error("invalid token");
			}
			user.password = createHash(password);
			await user.save();
			return user;
		} catch (error) {
			console.log("Error getting users", error);
		}
	}

	async deleteUserById(id) {
		try {
			const user =
			await UserModel.findById(id);
			if (!user) {
				throw new Error("no user found");
			}
			await cartsRepository.eraseCart(user.cart);
			await UserModel.findByIdAndDelete(id);

			return "Usuario eliminado";


			
		} catch (error) {
			throw new Error("couldn't delete user");
		}
	}

	endsWith(str) {
		if (email.includes(str)) {
			return true;
		}
	}
}

export default UserRepository;
