const mongoose = require ("mongoose");
require ("dotenv").config({path:'../../.env'});

const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_CONNECTIONTWO);
        console.log("Db connected")
    }catch(e){
        console.log(e,"db fail")
    }
}

module.exports = {
    dbConnection
}