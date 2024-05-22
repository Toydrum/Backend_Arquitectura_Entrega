import nodemailer from "nodemailer";

class EmailManager {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail", // use 'gmail' or your preferred email service
			auth: {
				user: "hm.covar@gmail.com", // replace with your email
				pass: "sjlm czgq nzlf cpkh", // replace with your password
			},
		});
	}

	async restEmail(email, firstname, token) {
		console.log(email);
		try {
			const mailOptions = {
				from: "Ecommerce <hm.covar@gmail.com>",
				to: email,
				subject: firstname,
				html: `
        Please click this link to reset your password: 
				<br><a href="http://localhost:8080/views/change-password?token=${token}">Restablecer contraseña</a>
        
        `,
			};

			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error(error);
		}
	}
}

export default EmailManager;
