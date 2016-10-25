'use strict';

const Promise = require("bluebird"),
      querystring = require('querystring'),
      https = require('https'),
      _ = require('lodash');

const Album = require('../models/album');

import { owner_id, v } from './consts.js';
import { access_token } from './secrets.js';

export const getAllAlbums = () => {
  return getAlbums().then((vk_albums) => {
    return Album.saveMany(vk_albums);
  })
}

const getAlbums = () => {
  const method = "photos.getAlbums";

  const query = querystring.stringify({
                                    owner_id, 
                                    v,
                                    access_token
                                  });
  const options = {
    host: 'api.vk.com',
    path: `/method/${method}?${query}`,
    method: 'GET'
  };

  var vk_albums = "";

  return new Promise((resolve, reject) => {
    const httpreq = https.request(options, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        vk_albums += chunk;
      });
      response.on('end', () => {
        resolve(JSON.parse(vk_albums).response.items);
      })
    });
    httpreq.end();
  })  
}
