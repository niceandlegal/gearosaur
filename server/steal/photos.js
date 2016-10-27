'use strict';

const Promise = require("bluebird"),
      https = require('https'),
      querystring = require('querystring'),
      _ = require('lodash'),
      Album = require('../models/album'),
      Photo = require('../models/photo');

import { owner_id, v } from './consts.js';
import { access_token } from './secrets.js';

// Get photos from all albums
export const getAllPhotos = () => {
  console.log('\nStart stealing photos\n');
  return new Promise((resolve, reject) => {
    // Find all albums
    Album.find().then((albums) => {
      return new Promise((resolve, reject) => {
        let sequence = Promise.resolve();
        albums.map((album) => {
          sequence = sequence.then(() => {
            // Get photos from one album 
            return getPhotosFromAlbum(album.id, album.size)
            .then((photos) => {
              // Save those photos from one album
              return Photo.saveMany(photos);
            })
            .then(({numberOfUpdatedPhotos, numberOfNewPhotos}) => {
              console.log(`All photos from album "${album.title}" (${album.id}) are saved`);
              console.log(`New: ${numberOfNewPhotos}; Updated: ${numberOfUpdatedPhotos}; Total: ${album.size}`);
            })
          })
        })
        resolve(sequence);
      })
      .then(() => {
        resolve();
      })
    })
  })
}

// Get photos from album
const getPhotosFromAlbum = (album_id, album_size) => {
  if (album_size == 0) {
    return Promise.resolve([]);
  }

  let method = "photos.get",
        rev = 1,
        extended = 1,
        offset = 0,
        count = 1000,
        need_system = 1;
  
  let query = querystring.stringify({
                                    owner_id,
                                    album_id,
                                    v,
                                    access_token,
                                    rev,
                                    extended,
                                    offset,
                                    count,
                                    need_system
                                  });
  let options = {
    host: 'api.vk.com',
    path: `/method/${method}?${query}`,
    method: 'GET'
  };
  
  return new Promise((resolve, reject) => {
    let photos = [];
    for (let i = 0; i < Math.ceil(album_size / count); i++){  
      let vk_photos = "";
      offset = i * count;
      query = querystring.stringify({
                                  owner_id,
                                  album_id,
                                  v,
                                  access_token,
                                  rev,
                                  extended,
                                  offset,
                                  count,
                                  need_system
                                });
      options = {
        host: 'api.vk.com',
        path: `/method/${method}?${query}`,
        method: 'GET'
      };
      const httpreq = https.request(options, (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          vk_photos += chunk;
        });
        
        response.on('end', () => {
          if (JSON.parse(vk_photos).error) {
            console.log(vk_photos);
          }
          let parsedPhotos = JSON.parse(vk_photos).response.items;
          photos = photos.concat(parsedPhotos);
          if (photos.length == JSON.parse(vk_photos).response.count) {
            resolve(photos);
          }
        })
      });
      httpreq.on('error', (e) => {
        console.error(e);
      });
      httpreq.end();
    }    
  }).catch((e) => {
    console.log(e);
  })
}