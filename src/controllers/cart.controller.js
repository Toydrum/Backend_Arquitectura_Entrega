import CartsRepository from "../repositories/carts.repository.js";
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
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const quantity = req.body.quantity || 1;
		try {
			await cartRepository.addProductToCart(cartId, productId, quantity);
			res.send("Producto agregado");
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
}

export default CartController;
