const express = require('express');
const subdomain = require('express-subdomain');
const logger = require('../logger');
const Mii_route = require('./module');
const miiRouter = express.Router();
const console = express.Router();


logger.info('Creating \'Mii-CDN\'subdomain');
miiRouter.use(subdomain('mii-maybesecure', console));


// Setup routes
logger.info('[Mii-CDN] Applying imported routes');
miiRouter.use('/', Mii_route.Mii);
module.exports = { miiRouter };
