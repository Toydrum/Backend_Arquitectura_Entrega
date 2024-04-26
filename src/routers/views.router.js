import express from 'express';
import passport from 'passport';
import UserRepository from '../repositories/users.repository.js';



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


export default router;