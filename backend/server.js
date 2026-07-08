const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./src/config/db");
const bodyParser=require("body-parser");
const userRouter = require('./src/routes/user.routes');
const bookRouter = require('./src/routes/book.routes');


const app=express();
dotenv.config();
app.use(bodyParser.json());


// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB Bağlantısını işə salırıq
connectDB();

app.use(userRouter);
app.use(bookRouter);

// Serveri dinləyirik
app.listen(process.env.PORT, () => {
    console.log("API Listened");
});

