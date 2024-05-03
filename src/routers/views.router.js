import express from 'express';
import passport from 'passport';
import UserRepository from '../repositories/users.repository.js';
import generarUProductos from '../utils/faker.js';



const userRepository = new UserRepository();
const router = express.Router();


router.get("/login", (req, res) =>{
  res.render("login")
})


router.get("/register", (req, res)=>{
  res.render("register");
})



router.get("/products", (req, res) =>{
  res.render("realTimeProducts")
})


router.get("/mokingproducts", (req,res)=>{
  const products = [];

  for(let i =0; i<10; i++) {
    products.push(generarUProductos());
  };
  console.log(products)
  res.render("mockingProducts", {products: products});
})


export default router;