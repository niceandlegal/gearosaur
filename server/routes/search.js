'use strict';

const logger = require('log4js').getLogger(),
  Photo = require('../models/photo');

module.exports = function (router) {

  router.get('/api/search', function (req, res, next) {
    logger.info('Search string:', req.query.q);
    logger.info('Last item date:', req.query.last_item_date);
    
    const last_item_date = req.query.last_item_date ? req.query.last_item_date : new Date();
    
    Photo
    .find({ 
      "text": { "$regex": req.query.q, "$options": "i" },
      "date": { $lt: last_item_date }
    })
    .sort({'date': -1})
    .limit(20)
    .then((data) => {
      logger.info('Found:', data.length);
      res.status(200).json(data);
    })
  });

  return router;
};
