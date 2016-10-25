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
  }
});

// Save bunch of photos.
photoSchema.statics.saveMany = function(photos) {
  let newPhotos = []; 

  return Promise.all(photos.map((vkPhoto) => {
    return new Promise((resolve, reject) => {
      // Check if this photo already exists in DB.
      this.findOne({id: vkPhoto.id}).then((photo) => {
        // Nope, it's a new photo. Push it into array of new photos.
        if (photo == null) {
          newPhotos.push(vkPhoto);
          resolve();
        }
        // Photo exists, update and save it.
        else {
          photo = _.merge(photo, vkPhoto);
          photo.save().then(() => { resolve(); });
        }
      })
    })
  }))
  .then(() => {
    console.log('newPhotos.length', newPhotos.length);
    // Insert all new photos into DB. It's faster this way.
    if (newPhotos.length > 0) {
      return this.insertMany(newPhotos).then(() => {});
    }    
  })
}

module.exports = mongoose.model('Photo', photoSchema);