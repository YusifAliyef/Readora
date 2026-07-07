const {checkToken}=require("../controllers/user.controller");

const endpoints={
    user:{
        register:"/register",
        login:"/login",
        checkToken:"/check"
    }
}

module.exports=endpoints