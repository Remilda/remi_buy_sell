var path = require("path");
module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  view : path.join(__dirname, "../public/views"),
  google_map_key : 'AIzaSyBhIJM3df9HJqMFofALpSBkgFrjPGDSrtg',
  google_embed_map_key : 'AIzaSyAxk9vCgnCZ_1YP96JJxt2RwyNbIIf03k8',
  base_url:'http://localhost:3000',
};
