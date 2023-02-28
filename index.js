const  express =  require("express")
const cors = require('cors')
// const { initPuppeter } = require("./routes/bot")
const { dbConnection } = require("./src/dataBase/db.js")
require('dotenv').config()
// require('dotenv').config({path:'../.env'})
const app = express()
dbConnection()


app.set("port", process.env.PORT || 2500)

app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());

// app.use('/', route)

const server = app.listen(app.get("port"), () => {
    console.log("Server is on port" + " " + process.env.PORT)
})

    // initPuppeter()