const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { route } = require('./fruit');

const router = express.Router();

router.get('/signup', (req, res) => {

    res.render('users/signup.ejs');
});

router.post('/signup', async (req, res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        await User.create(req.body);
        res.redirect('/user/login');
    }catch{
        res.send('there was an error');
    }
});



router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    // const { username } = req.body; or const username= req.body.username;
    // const user = await User.findOne({ username });

    //case where the username entered does not exist in the DB
    if (!user) {
        res.send('user doesnt exist')
    } else {
        //compare the password that was entered on the Form (req.body.password) 
        //to the password that is save in the DB
        const passmatches = bcrypt.compareSync(req.body.password, user.password)
        // if there is a match the variable call result will be truthy
        if (passmatches) {
            req.session.username = req.body.username;
            req.session.loggedIn = true;
            res.redirect('/fruit');

        //if the password does not match
        } else {
            res.send('wrong password')
        }
    }
});


// destroy the session an have the user go back to the / route
router.get('/logout', (req, res ) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
})

module.exports = router;