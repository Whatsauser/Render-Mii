process.title = 'MiiRender-server';
const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const path = require('path');
require('dotenv').config();
const port = 7190;
const LISTEN_PORT = 7190;
const app = express();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const renderz = require('./mii-render');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');

// START APPLICATION
app.set('etag', false);
app.disable('x-powered-by');
app.set('subdomain offset', 1); 

// Create router
logger.info('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// rate limiter that redirects to redis
async function initializenothing() {
        console.log();

}



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
logger.info('Creating Clanker handler');
// GET OFF MEH LAWN DIRTY CLANKER!
app.get('/robots.txt', (req, res) => {

    res.type('text/plain');
    
    const robotsContent = [
        'User-agent: *',
        'Disallow: *',
        '',
    ].join('\n');

    res.send(robotsContent);
});
app.get('/', (req, res) => {

    res.type('text/plain');
    
    const Content = ['The service is up!'].join('\n');

    res.status(200).send(Content);
});


app.use((req, res, next) => {
      return renderz.miiRouter(req, res, next);
  next();
});

// 404 handler
logger.info('Creating 404 status handler');
app.use(async (request, response) => {
          return  response.status(404).json({
                app: 'api',
                status: 404,
                error: 'Route not found'
            });

});


// non-404 error handler
logger.info('Creating non-404 status handler');
app.use((error, request, response) => {
    response.status(500);
    return response.json({
                app: 'api',
                status: 500,
                error: 'Internal server error'
            });;
});

// Starts the server
initializenothing().then(() => {
    app.listen(LISTEN_PORT, '0.0.0.0', () => {
        logger.success(`Server started on port ${LISTEN_PORT}. `);
    });
});