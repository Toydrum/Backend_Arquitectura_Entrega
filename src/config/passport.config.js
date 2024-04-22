import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
	passport.use(
		"jwt",
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
				secretOrKey: "coderhouse",
				//Misma palabra que tenemos en la App.js! No se olviden!
			},
			async (jwt_payload, done) => {
				try {
					return done(null, jwt_payload);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

//Creamos el cookie extractor

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["coderCookieToken"];
	}
	return token;
};

export default initializePassport;
