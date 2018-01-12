var path = require("path");
module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  view : path.join(__dirname, "../public/views")
};
