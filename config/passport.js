const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/users');


module.exports = function (passport) {


    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {


            User.findOne({
                email: email
            }).then(user => {
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' })
                }
            
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user)
                    }
                    else {
                        return done(null, false, { message: 'Password incorrect' })
                    }
                });
            })

            
        })
        );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}