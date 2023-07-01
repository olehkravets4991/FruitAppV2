require('dotenv').config();
const express = require('express');
const app = express();
const FruitRouter = require('./controllers/fruit');
const UserRouter = require('./controllers/user');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//middleware
app.use(express.static("public"));
app.use(express.urlencoded()); //allows the the req.body to be read from the form
//will have a prefix of /fruit on top of what is defined as a path on Fruitrouter
app.use(methodOverride('_method'));
//the set up below is how we add the ability to track if the user has authorization to access authorized routes
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL}),
    saveUninitialized: true, 
    resave: false,
}));
app.use("/fruit", FruitRouter);
app.use("/user", UserRouter);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));