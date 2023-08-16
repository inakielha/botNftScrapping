const mongoose = require ("mongoose");
// require ("dotenv").config();

require ("dotenv").config({path:'../../.env'});
// console.log(require ("dotenv").config({path:'../.env'}))

   async function dbConnection () {
    try {
        // mongoose.connect(process.env.MONGO_URL);
        mongoose.connect(process.env.MONGO_CONNECTION);
        console.log("Db connected")
    }catch(e){
        console.log(e,"db fail")
    }
}

module.exports = {
    dbConnection
}