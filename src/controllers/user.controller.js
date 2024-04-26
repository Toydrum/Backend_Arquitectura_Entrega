import passport from "passport";
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
			if(!newUser){
				console.log("el usuario ya existe")
				res.send({message: "el usuario ya existe"});
			} else{
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
			const rUser = {
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.lastname,
				password: user.password,
				rol: user.rol,
				age: user.age,
				cart: user.cart
			}
			
			const products = user.cart?.products
			? user.cart.products.map((u) => {
					const { _id, ...rest } = u.product.toObject();
					//console.log(rest)
					return rest;
				})
			: null;
			//console.log("user controller", products)
			res.status(200);
			res.render("current", {
				user: rUser,
				cart: user.cart,
				cartProducts: products
			});
		} catch (error) {
			res.status(500).send("Error al buscar usuario");
		}
	}

	async logInUser(req, res) {
		const { email, password } = req.body;
		//console.log(email, password)
		try {
			const currentUser = await userRepository.logInUser({ email, password });
			//console.log("login user controller",currentUser)
			if (currentUser) {
				res.status(200);
				res.cookie("coderCookieToken", currentUser, { httpOnly: true });
				//res.render("current")
				res.redirect("/users/current");
			} else {
				res.redirect("/views/login");
			}
		} catch (error) {
			res.status(500).send("Error al obtener usuario");
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
