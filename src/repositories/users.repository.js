import UserModel from "../models/user.model.js";
import CartsRepository from "./carts.repository.js";
const cartsRepository = new CartsRepository();

class UserRepository {

async createUser(first_name, last_name, email, password, age){
  
  try {
    if(!first_name || !last_name || !email || !password	|| !age) {
      console.log("todos los campos son requeridos")
      return 
    }
  
    const users = await this.getUsers();
    const cart = await cartsRepository.createCart();
    const userExists = users.find(item => item.email === email);
    //console.log(userExists)
    
    if(userExists) {
      console.log("user already exists")
    };
    const user = new UserModel({
      first_name,
      last_name,
      email,
      password,
      age,
      cart
    });

console.log(user)
  
    await user.save();
    return user;
  } catch (error) {
    console.log("error");
  }
};



async getUsers() {
  try {
    const user = await UserModel.find();
    return user
  } catch (error) {
    console.log("Error getting users", error)
  }
}









}

export default UserRepository;