import ProductModel from '../models/product.model.js';
import CartsRepository from './carts.repository.js';
import UserRepository from './users.repository.js';
import EmailManager from '../services/emailManager.js';
import { th } from '@faker-js/faker';


const cartsRepository = new CartsRepository();
const userRepository = new UserRepository();
const emailManager = new EmailManager();

class ProductsRepository {
    async all() {
        try {
            const products = await ProductModel.find();
            return products; 
        } catch (error) {
            throw new Error("Error al obtener los productos");
        }
    }

    async getProductById(pid) {
        try {
            const product = await ProductModel.findById(pid);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto");
        }
    }

    async createProduct({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
           // const productDTO = new JugueteDTO(productoData);
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }
            const existeProducto = await ProductModel.findOne({ code: code });
            
            if (existeProducto) {
                existeProducto.stock = existeProducto.stock + stock;
                await existeProducto.save();
                return existeProducto;
            }
            console.log(owner)
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                owner: owner,
                thumbnails: thumbnails || []
            });
            
            
            //console.log(newProduct, "wiii");
            await newProduct.save();
            return newProduct; 

        } catch (error) {
            //console.log(error);
            throw new Error("Error al crear el producto");
        }
    }

    async updateProduct(id, updateProduct){
        try {
            
            console.log(updateProduct)
            const productUpdate = await ProductModel.findByIdAndUpdate(id, updateProduct, { new: true });
            if (!productUpdate) {
                throw new Error('Product not found');
            }
            await productUpdate.save();
            return productUpdate;

        } catch (error) {
            console.log(error)
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(pid){
        try {
            const product = await ProductModel.findById(pid);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            console.log(product.owner)
            const owner = await userRepository.getUserById(product.owner);
            const cart = await cartsRepository.getCartById(owner.cart);
            if(owner.rol === "premium"){
                const email = owner.email;
                const subject = "Producto eliminado";
                await emailManager.prodDeleteEmail(email, subject, product.title);
                await ProductModel.findByIdAndDelete(pid);
                await cartsRepository.deleteProductFromCart(cart._id, pid);
                
            }
                await ProductModel.findByIdAndDelete(pid);
                await cartsRepository.deleteProductFromCart(cart._id, pid);
                return "Producto eliminado";

        
        } catch (error) {
            console.log(error);
            throw new Error("Error al eliminar el producto");
        }
    }
}
export default ProductsRepository;