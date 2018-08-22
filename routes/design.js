/*jshint node:true, latedef:nofunc*/
"use strict";

var express = require('express');
var router = express.Router();
var path = require('path');

// GET design page
router.get('/', designRouterCallback);
function designRouterCallback (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public','design.html'));
}

module.exports = router;
