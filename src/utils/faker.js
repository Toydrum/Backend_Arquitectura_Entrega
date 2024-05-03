import { faker } from "@faker-js/faker";
import CartsRepository from "../repositories/carts.repository.js";
const cartRepository = new CartsRepository();


const generarProductos = () =>{
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    img: faker.image.urlPicsumPhotos(),
    code: faker.finance.pin(),
    price: parseInt(faker.commerce.price()),
    stock: faker.number.int({min:1, max: 10}),
    category: faker.commerce.productAdjective(),
    status: true,
    thumbnails: []
  }
}

export default generarProductos;