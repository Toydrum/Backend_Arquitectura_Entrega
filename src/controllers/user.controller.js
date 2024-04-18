import UserRepository from "../repositories/users.repository.js";
const userRepository = new UserRepository();

class UserController {
  async createUser(req, res) {
    const {first_name, last_name, email, password, age} = req.body;

    try {
      const newUser = await userRepository.createUser(first_name, last_name, email, password, age);
      res.status(200).json(newUser)
    } catch (error) {
      res.status(500).send("Error al crear usuario");

    }

  }
}

export default UserController;