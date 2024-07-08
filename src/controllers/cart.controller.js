import CartsRepository from "../repositories/carts.repository.js";
import UserRepository from "../repositories/users.repository.js";
const userRepository= new UserRepository();
const cartRepository = new CartsRepository();

class CartController {
	async newCart() {
		try {
			const newCart = await cartRepository.createCart();
			res.json(newCart);
		} catch (error) {
			res.status(500).send("Error al crear carrito");
		}
	}
	async getCart(req, res) {
		try {
			const cartId = req.params.cid;
			//console.log(cartId);
			const cart = await cartRepository.getCartById(cartId);
			res.status(200).json(cart);
		} catch (error) {
			res.status(500).send("arror al traer el carrito");
		}
	}

	async addProductToCart(req, res) {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;
			const body = req.body
			
			const cart = await cartRepository.addProductToCart(cartId, productId, body);
			await console.log(cart);
			res.json(cart);
		} catch (error) {
			
			res.status(500).send("error al agregar producto");
		}
	}

	async deleteProductFromCart(req, res) {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		try {
			const cart = await cartRepository.deleteProductFromCart(
				cartId,
				productId
			);
			res.json({
				status: "succes",
				message: "Producto eliminado",
				cart,
			});
		} catch (error) {
			res.status(500).send("Error al eliminar producto");
		}
	}

	async updateProductsFromCart(req, res) {
		const cartId = req.params.cid;
		const updatedProducts = req.body;
		try {
			const cart = await cartRepository.updateProductsFromCart(
				cartId,
				updatedProducts
			);
			res.json({
				status: "succes",
				message: "Producto actualizado",
				cart,
			});
		} catch (error) {
			res.status(500).send("Error al actualizar producto");
		}
	}

	async updateProductAmountInCart(req, res) {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const newQuantity = req.body.quantity;
		try {
			const cart = await cartRepository.updateProductAmountInCart(
				cartId,
				productId,
				newQuantity
			);
			res.json({
				status: "succes",
				message: "Producto actualizado",
				cart,
			});
		} catch (error) {
			res.status(500).send("Error al actualizar producto");
		}
	}

	async deleteCart(req, res) {
		const cartId = req.params.cid;
		try {
			const cart = await cartRepository.deleteCart(cartId);
			res.json({
				status: "succes",
				message: "Carrito vaciado",
				cart,
			});
		} catch (error) {
			res.status(500).send("Error al vaciar carrito");
		}
	}

	async purchaseItem(req, res) {
		
		try {
			
			const {cid, uid} = req.params
			const user = await userRepository.getUserById(uid);
			if(!user) throw new Error("no se encontró al usuario");
			const rUser = [user].map((u)=>{
				const { _v, ...rest } = u.toObject();
					//console.log(rest)
					u.cart = [u.cart].map((c) => {
						const { _v, ...rest } = c.toObject();
						//console.log(rest)
						return rest;
					})[0]
					return rest;
			})[0]
			const ticketInfo = await cartRepository.createTicket(cid, uid);
			if(!ticketInfo){
				throw new Error("no se guardo bien la info del ticket");
			}
			
			res.status(200);
			res.render("current", {
				user: rUser,
				cartProducts: ticketInfo.notInstockProducts.map((p)=>{
					p.message = "No hay suficiente stock";
					const { _v, ...rest } = p.toObject();
					//console.log(rest)
					return rest;
					
				}),
				ticketInfo: ticketInfo.savedTicket.toObject()
			});
		} catch (error) {
			console.error(error)
			res.status(500).send("Error al traer ticket");
		}
	}
}

export default CartController;
