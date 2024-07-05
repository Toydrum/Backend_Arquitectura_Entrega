//import UserModel from "../models/user.model.js";
import { jwtDecode } from "jwt-decode";
import ProductModel from "../models/product.model.js";
import ProductRepository from "../repositories/products.repository.js";
import tokenCreator from "../utils/tokenCreator.js";
const productRepository = new ProductRepository();

class ProductController {
	async getProducts(req, res) {
		const {page = 1, limit = 4} = req.query;
		try {
			const user = req.cookies["coderCookieToken"];
			const userDecoded = jwtDecode(user);
			console.log(userDecoded);
			const userCart = userDecoded.cart;
			
			const products = await ProductModel.paginate({},{page, limit});
			//console.log(products);
			//const productos = await productRepository.all();
			const finalProducts = products.docs.map(product => {
				const fProducts = product.toObject();
				return fProducts;
			})
			res.status(200);
			res.render("products", {
				userCart: userCart,
				products: finalProducts,
				hasPrevPage: products.hasPrevPage,
				hasNextPage: products.hasNextPage,
				prevPage: products.prevPage,
				nextPage: products.nextPage,
				currentPage: products.page,
				totalPages: products.totalPages

			});
		} catch (error) {
			res.status(500).json("Error del servidor");
		}
	}

	async getProductById(req, res) {
		const {pid} = req.params;
		try {
			const product = await productRepository.getProductById(pid);
			res.status(200).send(product);
			;
		} catch (error) {
			res.status(500).json("Error del servidor"); 
		}
	
	}
	async postProducts(req, res) {
		try {
			let nuevoProducto = req.body;
			nuevoProducto = {code: tokenCreator(), ...nuevoProducto}
			let owner =  req.cookies["coderCookieToken"];
			let ownerDec = jwtDecode(owner);
			nuevoProducto.owner = ownerDec._id;
			console.log(ownerDec);
			
		const created =	await productRepository.createProduct(nuevoProducto);
		console.log(created)
			res.status(200)
			res.redirect("/products")
			//res.render("realTimeProducts")
		} catch (error) {
			res.status(500).json("Error del servidor wiii");
		}
	}

	async updateProduct(req, res) {
		
	}

	async deleteProduct(req, res){
try {
	const{pid} = req.params;
  const deletedProduct = await productRepository.deleteProduct(pid);
	res.status(200).send("Producto eliminado");	

} catch (error) {
	console.log(error);
	throw new Error("Error al eliminar el producto");
}	}
}

export default ProductController;
