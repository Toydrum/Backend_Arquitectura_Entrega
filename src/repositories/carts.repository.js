import CartModel from "../models/cart.model.js";


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
      console.log(cart)
			if (!cart) {
				console.log("No cart with that id");
				return null;
			}

			return cart;
		} catch (error) {
			console.log("Error finding cart", error);
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










}


export default CartsRepository;
