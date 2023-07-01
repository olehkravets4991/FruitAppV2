const mongoose = require('./connection');
const Fruit = require('./fruit');


mongoose.connection.on('open', async () => {

    //1. create entries into the db using the startFruits
    //1a. in order to do this we need to delete everything
    await Fruit.deleteMany();

    //1b. then using startFruits, we will insert that into the db
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
    ];
    await Fruit.create(startFruits);

    //2. we are going to close the connection
    mongoose.connection.close();
});