import UserModel from "../models/user.model.js";
import CartsRepository from "./carts.repository.js";
//import passport from "passport";
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
				console.log("user already exists");
			}
			const cart = await cartsRepository.createCart();
			if(!cart) {
				throw new Error("no se creo carrito");
			}
			const user = new UserModel({
				firstname,
				lastname,
				email,
				password: createHash(password),
				age,
				cart: cart._id,
				rol: UserModel.rol,
			});

			console.log(user);

			await user.save();
			const token = jwt.sign({ ...user._doc }, "coderhouse");
			return token;
		} catch (error) {
			console.log("error con mongo");
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
				const token = jwt.sign( {...currentUser._doc} , "coderhouse");
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

	async updateUserById(updatedUser, id){
		try {
			let user = await UserModel.findByIdAndUpdate(id, updatedUser)
			//console.log(user);
			await user.save()
			return user
		} catch (error) {
			
		}
	}

	async getUserById(id){
		try {
			const user = await UserModel.findById(id)
			if(!user) {
				throw new Error("no user found")
			}
			return user
		} catch (error) {
			console.log("Error getting users", error);
		}
	}
}

export default UserRepository;
