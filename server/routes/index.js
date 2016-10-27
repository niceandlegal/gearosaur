'use strict';

const express = require('express');
let router = express.Router();

router = require('./search')(router);

module.exports = router;