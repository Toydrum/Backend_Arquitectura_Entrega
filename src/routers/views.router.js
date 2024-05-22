import express from 'express';
import ViewsController from '../controllers/views.controller.js';

import generarUProductos from '../utils/faker.js';
import UserController from '../controllers/user.controller.js';
const userController = new UserController();
const viewsController = new ViewsController();



//const userRepository = new UserRepository();
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

router.get("/loggertest", (req,res)=>{
  req.logger.fatal("x_x");
  req.logger.error("error");
  req.logger.warning("warning, check your code");
  req.logger.info("no errors detected");
  req.logger.http("ruta"); 

  res.send("Logs generated")
})

router.get("/reset-password", viewsController.renderResetPassword);
router.get('/confirmation', (req,res)=>{
  res.render('sendConfirmation')
})
router.get("/change-password/:token?", (req,res)=>{
  res.render("passwordChange")
})


export default router;