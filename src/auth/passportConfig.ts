import User from '../models/User';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

module.exports = function(passport: any) {
    passport.use(new LocalStrategy(
        { usernameField: 'email' }, // Specify that the username field is 'email'
        async (email: string, password: string, done: (error: any, user?: any, options?: any) => void) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } catch (err: any) {
                return done(err);
            }
        }
    ));
}