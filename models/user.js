const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    require: true,
    default:
      'https://unbugster.github.io/mesto/f5e0ad99ef2471c057b5.jpeg',
  },
});

module.exports = mongoose.model('user', userSchema);
