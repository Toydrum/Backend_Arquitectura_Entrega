import nodemailer from "nodemailer";

class EmailManager {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "hm.covar@gmail.com",
				pass: "ujxi pitx yijf pgqi",
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
}
export default EmailManager;
