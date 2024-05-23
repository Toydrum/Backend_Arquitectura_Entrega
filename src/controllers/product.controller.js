//import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import ProductRepository from "../repositories/products.repository.js";
const productRepository = new ProductRepository();

class ProductController {
	async getProducts(req, res) {
		const {page = 1, limit = 4} = req.query;
		try {
			const products = await ProductModel.paginate({},{page, limit});
			//console.log(products);
			//const productos = await productRepository.all();
			const finalProducts = products.docs.map(product => {
				const {_id, ...rest} = product.toObject();
				return rest;
			})
			res.status(200);
			res.render("products", {
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

	async postProducts(req, res) {
		try {
			let nuevoProducto = req.body;
			nuevoProducto.owner = req.user;
			
			//console.log(nuevoProducto)
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
}

export default ProductController;
