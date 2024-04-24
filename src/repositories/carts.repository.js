import CartModel from "../models/cart.model.js";
import TicketModel from "../models/ticket.model.js";

class CartsRepository {
	async createCart() {
		try {
			const nuevoCarrito = new CartModel({ products: [] });
			await nuevoCarrito.save();
			return nuevoCarrito;
		} catch (error) {
			console.log("Error creating cart");
		}
	}

	async getCartById(cid) {
		try {
			const cart = await CartModel.findById(cid);
			console.log(cart);
			if (!cart) {
				console.log("No cart with that id");
				return null;
			}

			return cart;
		} catch (error) {
			console.log("Error finding cart", error);
		}
	}

	async getProductsFromCart(cartId) {
		try {
			const cart = await CartModel.findById(cartId);
			if (!cart) {
				console.log("No hay carrito con ese ID");
			}
			return cart;
		} catch (error) {}
	}

	async addProductToCart(cartId, productId, quantity = 1) {
		try {
			const cart = await this.getProductsFromCart(cartId);
			const existeProducto = cart.products.find(
				(item) => item.product._id.toString() === productId
			);

			if (existeProducto) {
				existeProducto.quantity += quantity;
			} else {
				cart.products.push({ product: productId, quantity });
			}
			cart.markModified("products");
			await cart.save();
			return cart;
		} catch (error) {
			throw new Error("Error al agregar producto");
		}
	}

	async updateProductsFromCart(cid, updatedProducts) {
		try {
			const cart = await CartModel.findById(cid);

			if (!cart) {
				throw new Error("Cart not found");
			}

			cart.products = updatedProducts;

			cart.markModified("products");

			await cart.save();

			return cart;
		} catch (error) {
			console.error("Error updating cart", error);
			throw error;
		}
	}

	async updateProductAmountInCart(cid, pid, newQuantity) {
		try {
			const cart = await CartModel.findById(cid);

			if (!cart) {
				throw new Error("not found");
			}

			const productIndex = cart.products.findIndex(
				(item) => item.product._id.toString() === pid
			);

			if (productIndex !== -1) {
				cart.products[productIndex].quantity = newQuantity;

				cart.markModified("products");

				await cart.save();
				return cart;
			} else {
				throw new Error("Product not found in cart");
			}
		} catch (error) {
			console.error("Error updating product in cart", error);
			throw error;
		}
	}

	async deleteCart(cid) {
		try {
			const cart = await CartModel.findByIdAndUpdate(
				cid,
				{ products: [] },
				{ new: true }
			);

			if (!cart) {
				throw new Error("Cart not found");
			}

			return cart;
		} catch (error) {
			console.error("Error deleting cart", error);
			throw error;
		}
	}

	async deleteProductFromCart(cid, pid) {
		try {
			const cart = await CartModel.findById(cid);

			if (!cart) {
				throw new Error("Cart not found");
			}

			cart.products = cart.products.filter(
				(item) => item.product._id.toString() !== pid
			);

			await cart.save();
			return cart;
		} catch (error) {
			console.error("Error deleting cart", error);
			throw error;
		}
	}

	async createTicket(cid, uid) {
		try {
			const cart = await this.getCartById(cid);
			if (cart && cart.products && cart.products.length > 0) {
				const products = cart.products;
				const total = products.reduce((acum, product) => {
					let price = product.product.price;
					let quantity = product.quantity;
					console.log(quantity)
					if ( quantity > 1) {
						price = price * quantity;
						
					}
					return acum + price;
				}, 0);

				const ticket = new TicketModel({
					code: this.generateRandomHex(5),
					purchaseDate: new Date(),
					amount: total,
					purchaser: uid.toString(),
				});
				console.log(ticket);
				await ticket.save();
				return ticket;
			}
		} catch (error) {
			console.error("Error creating ticket", error);
			throw error;
		}
	}

	generateRandomHex(length) {
		if (length > 0) {
			const hexChars = "0123456789ABCDEF";
			let hex = "";
			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * hexChars.length);
				hex += hexChars[randomIndex];
			}
			//console.log(hex)
			return hex;
		}
	}
}

export default CartsRepository;
