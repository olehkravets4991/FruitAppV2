const express = require('express');
const Fruit = require('../models/fruit');

//routing middleware that allows the routes defined on this file to be used on our server.js file
// as app.use('/fruits', FruitRouter)
const router = express.Router();


router.use((req, res, next) => {
    // req.session 
    //check to see if the user is logged in via the req.session.loggedIn property. This property was defined in the controller.user.js file
    //if the user is loggedIn we are going to use the next() which means allow the user to access the routes defined below
    if(req.session.loggedIn){
        next();
    } else {
        //else the user is NOT loggedIn, therefore just have the user redirected to the login page.
        res.redirect('/user/login')
    }
})

//controllers
router.get('/', async (req, res) => {
    const allFruits = await Fruit.find({ username: req.session.username })
    res.render(
        'fruits/index.ejs',
        { fruits: allFruits, user: req.session.username }
    )
});


router.get('/new', (req, res) => {
    res.render('fruits/new.ejs')
})


router.post('/', async (req, res) => {
    //example of the req.body OBJECT that comes in
    // {
    //     name: 'mango',
    //     color: 'green',
    //     readyToEat: 'on'
    // }
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    }else {
        req.body.readyToEat = false;
    }
    //this ternary will update the readyToEat property value similiar to how the 
    // conditional above does it
    // req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    
    //after it goes through conditional,
    //the req.body OBJECT will look like below
    // {
    //     name: 'mango',
    //     color: 'green',
    //     readyToEat: true
    // }

    req.body.username = req.session.username; 
    // {
    //     name: 'mango',
    //     color: 'green',
    //     readyToEat: true,
    //     username: req.session.username
    // }

    
    await Fruit.create(req.body);
    res.redirect('/fruit');
})


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const fruit = await Fruit.findById(id);
    res.render("fruits/show.ejs", { fruit })
})


router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await Fruit.findByIdAndDelete(id);
    res.redirect('/fruit')
})


router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const fruit = await Fruit.findById(id);
    res.render('fruits/edit.ejs', { fruit })
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false;
    await Fruit.findByIdAndUpdate(id, req.body);
    res.redirect('/fruit')
})



module.exports = router;