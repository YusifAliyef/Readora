const Joi=require("joi");


const bookValidation=(data)=>{
    const schema=Joi.object({
        title: Joi.string().min(2).required().messages({
            "string.empty": "Kitabın adı boş buraxıla bilməz",
            "string.min": "Kitabın adı ən az 2 simvol olmalıdır"
        }),
        author: Joi.string().min(2).required().messages({
            "string.empty": "Müəllif adı boş buraxıla bilməz"
        }),
        description:Joi.string().allow(""),
        price:Joi.number().min(0).required().messages({
            "number.min": "Qiymət mənfi ola bilməz"
        }),
        image: Joi.string().allow(""),
        stock: Joi.number().integer().min(0).required()
    });
    
    return schema.validate(data);
};

module.exports=bookValidation;
