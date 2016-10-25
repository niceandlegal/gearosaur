'use strict';

var mongoose = require('mongoose');

import { getAllAlbums } from './albums.js';
import { mongo_login, mongo_pass } from './secrets.js';

// -------------------
// Database connection
// ----------------------------------------------------------------------------------------------------
mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017/gearosaur');
//mongoose.connect(`mongodb://${mongo_login}:${mongo_pass}@ds019054.mlab.com:19054/heroku_jbnf49mc`);

var db = mongoose.connection;
// Connection success
db.once('open', (callback) => {
  let start = new Date();
  console.log('MongoDB connection success');  
  getAllAlbums()
  .tap(() => {
    console.log('Albums were stolen');
  })
  .then(() => {
    let end = new Date();
    let time = new Date(end - start);
    console.log(`Total time: ${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`);
    db.close();
  })
  .catch((e) => {
    console.log(e);
  });
});
