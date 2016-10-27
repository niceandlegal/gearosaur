const Promise = require("bluebird"),
      _ = require('lodash'),
      mongoose = require("mongoose"),
      Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

var photoSchema = new Schema({
  id: Number,
  album_id: Number,
  owner_id: Number,
  user_id: Number,
  text: String,
  date: { type: Date },
  photo_75: String,
  photo_130: String,
  photo_604: String,
  photo_807: String,
  photo_1280: String,
  photo_2560: String,
  width: Number,
  height: Number,
  likes: {
    user_likes: Number,
    count: Number
  },
  comments: {
    count: Number
  },
  can_comment: Number,
  tags: {
    count: Number
  },
  deleted: { 
    type: Boolean, 
    default: false 
  },
});

// Save bunch of photos.
photoSchema.statics.saveMany = function(photos) {
  let newPhotos = [],
      oldPhotos = [],
      numberOfUpdatedPhotos = 0;

  // Ids of photos to save
  let ids = photos.map(photo => photo.id);

  // Ids of albums of photos to save
  let albumIds = _.uniq(photos.map(photo => photo.album_id));

  return this.find({album_id: { $in: albumIds }}, {id: 1, _id: 0}).then(idObjects => {    
    // Ids from DB
    let dbIds = idObjects.map(idObject => idObject.id);
    // Ids of new photos, which are not in DB yet
    let newIds = _.difference(ids, dbIds);    
    // Ids of old photos, which should be updated
    let oldIds = _.difference(ids, newIds);
    // New photos
    newPhotos = photos.filter(photo => newIds.includes(photo.id));
    // Old photos
    oldPhotos = photos.filter(photo => oldIds.includes(photo.id));
  })
  .then(() => {
    // Update existing photos
    return Promise.all(oldPhotos.map(vkPhoto => {
      // Update only these fields.
      let setObj = {
        text: vkPhoto.text,
        likes: vkPhoto.likes,
        comments: vkPhoto.comments,
        tags: vkPhoto.tags
      }

      return this.update({id: vkPhoto.id}, {$set: setObj}).then(() => {
        numberOfUpdatedPhotos++;
      })
    }))
  })
  .then(() => {
    // Insert all new photos into DB. It's faster this way.
    if (newPhotos.length > 0) {
      return this.insertMany(newPhotos).then(() => {});
    }    
  })
  .then(() => {
    return { 
      numberOfUpdatedPhotos, 
      numberOfNewPhotos: newPhotos.length
    }
  })
}

module.exports = mongoose.model('Photo', photoSchema);