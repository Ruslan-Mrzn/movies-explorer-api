const mongoose = require('mongoose');
const npmValidator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v) => npmValidator.isEmail(v),
  },

  password: {
    type: String,
    required: true,
    select: false, // необходимо добавить поле select (чтобы убрать его из выдачи в теле ответа)
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

});

// добавим функцию для сокрытия пароля из выдачи по api-запросам
function hidePassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.hidePassword = hidePassword;

module.exports = mongoose.model('user', userSchema);
