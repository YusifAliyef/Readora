const Joi = require("joi");

// Qeydiyyat yoxlanışı
const registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Ad sahəsi boş buraxıla bilməz",
      "string.min": "Ad ən az 3 simvoldan ibarət olmalıdır",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Şifrə sahəsi boş buraxıla bilməz",
      "string.min": "Şifrə ən az 6 simvoldan ibarət olmalıdır",
    }),
  });

  return schema.validate(data);
};

// Giriş yoxlanışı
const loginValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().required().messages({
      "string.empty": "İstifadəçi adı boş buraxıla bilməz",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Şifrə sahəsi boş buraxıla bilməz",
    }),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
