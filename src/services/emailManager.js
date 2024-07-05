import nodemailer from "nodemailer";
import configObject from "../config/config.js";

class EmailManager {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "hm.covar@gmail.com",
				pass: configObject.pass,
			},
			tls: {rejectUnauthorized: false}
		});
	}

	async restEmail(email, firstname, token) {
		
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

	async sendEmail(email, subject, message) {
		try {
			const mailOptions = {
				from: "Ecommerce <hm.covar@gmail.com>",
				to: email,
				subject: subject,
				html: message,
			};
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error("error enviando email",error);
		}
	}

	async prodDeleteEmail(email, product, subject) {
		try {
			const mailOptions = {
				from: "Ecommerce <hm.covar@gmail.com>",
				to: email,
				subject: subject,
				html: `lamentamos informarle que el producto ${product} ha sido eliminado`,	
	
};
			await this.transporter.sendMail(mailOptions); 
	} catch (error) {
		console.error(error);
	}
}
}
export default EmailManager;
