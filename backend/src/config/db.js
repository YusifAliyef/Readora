const mongoose=require("mongoose");

const connectDB=()=>{
    mongoose.connect(process.env.DB_BASE_URL).then(()=>{
        console.log("DB Connected")
    })
    .catch((err)=>{
        console.log("DB Connection Error", err)
    })
}

module.exports=connectDB;