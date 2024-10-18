require('dotenv').config();
const mongoose = require('mongoose')
const URL = process.env.MONGO_DB_URL

const connectToDatabase = ()=>{
    mongoose.connect(URL).then(
        ()=>{
        console.log("Database Connected Successfully");
        return true
        }
        )
        .catch(err =>{
            console.log("Error caught while connecting to Db : ",err);
            console.log(err.message);
            return false;
        })
}

module.exports = connectToDatabase