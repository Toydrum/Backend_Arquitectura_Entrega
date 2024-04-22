import UserRepository from "../repositories/users.repository.js";

const userRepository = new UserRepository();

class UserController {
	async createUser(req, res) {
		const { firstname, lastname, email, password, age } = req.body;
		try {
			const newUser = await userRepository.createUser(
				firstname,
				lastname,
				email,
				password,
				age
			);
			res.status(200);
			res.cookie("coderCookieToken", newUser, { httpOnly: true });
			res.redirect("/views/current");
		} catch (error) {
			res.status(500).send("Error al crear usuario");
		}
	}

	async logInUser(req, res) {
		const { email, password } = req.body;
    //console.log(email, password)
		try {
			const currentUser = await userRepository.logInUser({ email, password });
      console.log(currentUser)
      if(currentUser){
			res.status(200);
			res.cookie("coderCookieToken", currentUser, { httpOnly: true });
			res.redirect("/views/current");
      } else{
        
        res.redirect("/views/login")
      }
		} catch (error) {
      res.status(500).send("Error al obtener usuario");
    }
	}
}

export default UserController;
