require('dotenv').config();
const express = require('express');
const app = express();
const Fruit = require('./controllers/fruit');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL}),
    saveUninitialized: true, 
    resave: false,
}));

app.get('/', (req, res) => {
    res.render('index.ejs')
})


app.get('/fruit', async (req, res) => {
    // const allFruits = [{ name: 'banana' }, { name: 'apple' }]

    const allFruits = await Fruit.find({})

    res.render(
        'fruits/index.ejs',
        { fruits: allFruits }

        // the above the same thing as 
        // {
        //     fruits: [{ name: 'banana' }, { name: 'apple' }] 
        // }
        // or 
        // is the same thing as 
        // {
        //     fruits: allFruits 
        // }
    )
});

app.get('/fruit/new', (req, res) => {
    res.render('fruits/new.ejs')
})

const UserRouter = require('./controllers/user');
app.use("/user", UserRouter);



const PORT = process.env.PORT;


app.listen(PORT, () => console.log(`app listening on port ${PORT}`))