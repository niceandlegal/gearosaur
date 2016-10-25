const Promise = require("bluebird");
const _ = require('lodash');
const mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  id: Number,
  thumb_id: Number,
  owner_id: Number,
  title: String,
  description: String,
  created: { type: Date },
  updated: { type: Date },
  size: Number,
  can_upload: Number,
  comments: Number
});

albumSchema.statics.saveMany = function(albums) {
  let newAlbums = [],
      numberOfUpdatedAlbums = 0;

  // Wait until all albums are saved separately 
  return Promise.all(albums.map((vkAlbum) => {
    return new Promise((resolve, reject) => {
      this.findOne({id: vkAlbum.id}).then((album) => {
        if (album == null) {
          newAlbums.push(vkAlbum);
          resolve();
        }
        else {
          album = _.merge(album, vkAlbum);
          album.save().then(() => {
            numberOfUpdatedAlbums++;
            console.log(`Album "${album.title}" (${album.id}) is updated`);
            resolve(); 
          });
        }
      })
    })
  }))
  .then(() => {
    if (newAlbums.length > 0) {
      return this.insertMany(newAlbums).then(() => {
        newAlbums.forEach((album) => {
          console.log(`Album "${album.title}" (${album.id}) is saved`);
        });
      });
    }
    console.log(`Number of updated albums: ${numberOfUpdatedAlbums}`);
    console.log(`Number of new albums: ${newAlbums.length}`);
  })
}

module.exports = mongoose.model('Album', albumSchema);