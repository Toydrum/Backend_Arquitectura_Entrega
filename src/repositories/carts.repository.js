import { es, th } from "@faker-js/faker";
import CartModel from "../models/cart.model.js";

import TicketModel from "../models/ticket.model.js";
import ProductsRepository from "./products.repository.js";

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

	async addProductToCart(cartId, productId, body) {
		try {
			const cart = await this.getProductsFromCart(cartId);
			const existeProducto = cart.products.find(
				(item) => item.product._id.toString() === productId
			);
			
			if (existeProducto) {

				const update = await this.updateProductAmountInCart(existeProducto.product._id.toString(), cart, body);
				
				
			} else {
				cart.products.push({ product: productId.toString(), quantity: body.quantity });
			}
			cart.markModified("products");
			await cart.save();
			return cart;
		} catch (error) {
			console.log(error);
			throw new Error("Error al agregar producto repository");
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

	async updateProductAmountInCart(pid, cartP, body) {
		try {
			console.log('body', body)
			const cart = cartP;
			const productIndex = cart.products.findIndex(
				(item) => item.product._id.toString() === pid
			);

			if (productIndex !== -1) {
				cart.products[productIndex] = body;

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

	async eraseCart(cid) {
		try {
			await CartModel.findByIdAndDelete(cid);
		} catch (error) {
			throw new Error("Error deleting cart", error);
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
			//console.log(cart)
			if (cart && cart.products && cart.products.length > 0) {
				// filtrar los productos que tengan suficiente stock
				//let quantity = cart.products.quantity;
				const notInstockProducts = [];
				const products = cart.products.filter((p) => {
					console.log("p:", p);
					if (p.product.stock >= p.quantity) {
						return true;
					} else {
						notInstockProducts.push(p);
						return false;
					}
				});
				console.log("not in stock products", notInstockProducts);
				console.log("products", products);

				const total = products.reduce((acum, product) => {
					let price = product.product.price;
					let quantity = product.quantity;
					console.log(price);
					if (quantity > 1) {
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
				const savedTicket = await ticket.save();
				if (!savedTicket) throw new Error("No se guardó el ticket");
				// guardar el nuevo stock de los productos
				products.forEach(async (p) => {
					const productsRepository = new ProductsRepository();
					const { _id, ...rest } = p.product;
					p.product.stock = p.product.stock - p.quantity;
					const productEdited = await productsRepository.updateProduct(
						p.product._id,
						{ ...rest, stock: p.product.stock}
					);
					if (!productEdited)
						{throw new Error(
							"no se actualizó el stock del producto" + p.product._id
						)} else {console.log("stock actualizado")};
				});
				await this.deleteCart(cid);	
				return {
					notInstockProducts,
					savedTicket,
				};
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
