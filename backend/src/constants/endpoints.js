const {checkToken}=require("../controllers/user.controller");


const endpoints={
    user:{
        register:"/register",
        login:"/login",
        checkToken:"/check"
    },
    books: {
        getAll: "/books",
        getByID: "/books/:id",
        post: "/books",
        put: "/books/:id",
        delete: "/books/:id"
    }
}

module.exports=endpoints