require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToDatabase = require('./Database/config');
const userRoute = require('./routes/userRoute.js')
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:'*'
}))

app.use("/api/users", userRoute);

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.use(errorHandler);




 app.listen(PORT,()=>{
        console.log('server listening at PORT : ',PORT)
        try{
            connectToDatabase();
        }catch(err)
        {
            console.log(err);
        }
})
