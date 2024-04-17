import ProductRepository from "../repositories/products.repository.js";
const productRepository = new ProductRepository();

class ProductController {
	async getProducts(req, res) {
		try {
			const productos = await productRepository.all();
			res.status(200).json(productos);
		} catch (error) {
			res.status(500).json("Error del servidor");
		}
	}

	async postProducts(req, res) {
		const nuevoProducto = req.body;
		try {
			//console.log(nuevoProducto);
			await productRepository.createProduct(nuevoProducto);
			res.status(200).send("producto creado");
		} catch (error) {
			res.status(500).json("Error del servidor wiii");
		}
	}
}

export default ProductController;
