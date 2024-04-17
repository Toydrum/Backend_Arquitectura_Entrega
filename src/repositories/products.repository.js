import ProductModel from '../models/product.model.js';


class ProductsRepository {
    async all() {
        try {
            const products = await ProductModel.find();
            return products; 
        } catch (error) {
            throw new Error("Error al obtener los juguetes");
        }
    }
  
    async createProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
           // const productDTO = new JugueteDTO(productoData);
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }
            const existeProducto = await ProductModel.findOne({ code: code });
            
            if (existeProducto) {
                console.log("El código debe ser único");
                return;
            }
            
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });
            
            
            //console.log(newProduct, "wiii");
            await newProduct.save();
            return newProduct; 

        } catch (error) {
            //console.log(error);
            throw new Error("Error al crear un juguete");
        }
    }
  }
export default ProductsRepository;