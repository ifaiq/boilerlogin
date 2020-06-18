const express = require('express');
const user = require('../models/users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router = express.Router();

router.get('/login', (req, res) => {


    res.render('login');


});

router.get('/register', (req, res) => {


    res.render('register');


});


router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let error = [];
    //check req fields


    if (!name || !email || !password || !password2) {

        error.push({ msg: 'fill all fields' });

    }
    //check password



    if (password !== password2) {

        error.push({ msg: 'Password not matching' });

    }

    //check length

    if (password.length < 6) {

        error.push({ msg: 'Password too shot atleat 6 digits' });

    }



    if (error.length > 0) {

        res.render('register', {
            error,
            name,
            email,
            password,
            password2
        });
    } else {

        user.findOne({ email: email }).then((users) => {
            if (users) {
                error.push({ msg: ' User already exist' });
                res.render('register',
                    {
                        error,
                        name,
                        email,
                        password,
                        password2

                    }
                );
            }
            else {

                const newUser = new user({
                    name,
                    email,
                    password,
                    password2
                })
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt ,(err , hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg','You are now connected');
                            res.redirect('/users/login');})
                        .catch(err = console.log(err));
                    })
                });
            }
        });
    }
});


//Login 
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect: '/users/login',
    failureFlash:true
})(req,res,next);

});
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;