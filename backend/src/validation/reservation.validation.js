const Joi=require("joi");

const reservationSchema=Joi.object({
    bookId:Joi.string().hex().length(24).required().messages({
        "string.hex": "Kitab ID-si düzgün formatda (hex) deyil",
        "string.length": "Kitab ID-si 24 simvoldan ibarət olmalıdır",
        "any.required": "Kitab ID-si mütləq göndərilməlidir"})
});

module.exports=reservationSchema;