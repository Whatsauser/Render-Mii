const router = require('express').Router();
const { Mii, ConsoleFormats } = require('miijs'); 
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

router.get('/mii', async (request, response) => {
    const data = request.query.Mii_data;
    const expression = request.query.expression;
    const render_type = request.query.type;
    const account = request.query.username;
        const width = Number(request.query.width);

    if (!data && !account) {
        return response.send('no Mii data or username sent');
    }

    if (data) {
        const resPath = path.join(process.cwd(), 'assets', 'FFLResHigh.dat');
        if (!fs.existsSync(resPath)) {
            console.error(`Missing FFLResHigh.dat at: ${resPath}`);
            return response.status(500).send('Missing core assets file');
        }
        const localFflBuffer = fs.readFileSync(resPath);
        const miiData = data;
        const miiBuffer = Buffer.from(miiData, 'base64');
        const myMii = new Mii(miiBuffer); 
        
        try {
            let imageBuffer = await myMii.render(false, {
                fflResBuffer: localFflBuffer, 
                expression: expression ? parseInt(expression) : 0
            });
                if (width && width !== 64) {
        imageBuffer = await sharp(imageBuffer)
            .resize(width, width)
            .toBuffer();
    }

            response.setHeader('Content-Type', 'image/png')
            return response.send(imageBuffer);
        } catch (error) {
            console.error('Failed to render Mii:', error);
            return response.status(500).send('Render failed');
        }
    }

    if (account) {
 const userid = await new Promise((resolve) => {
      // Gets pid to get Mii data
        const options = {
            hostname: 'account.samtendo.net',
            port: 443,
            path: `/v1/api/admin/mapped_ids?input_type=user_id&output_type=pid&input=${account}`,
            method: 'GET',
            servername: 'account.samtendo.net',
            headers: {
                'X-Nintendo-Client-ID': 'a2efa818a34fa16b8afbc8a74eba3eda',
                'X-Nintendo-Client-Secret': 'c91cdb5658bd4954ade78533a339cf9a'
            }
        };

        const proxyReq = https.request(options, (targetRes) => {
            const chunks = [];
            try {
                targetRes.on('data', (chunk) => chunks.push(chunk));

                targetRes.on('end', async() => {
                    const responseBuffer = Buffer.concat(chunks);
                    const xmlString = responseBuffer.toString('utf8');
                    const match = xmlString.match(/<out_id>(.*?)<\/out_id>/);
                    resolve(match ? match[1] : null);
                });
            } catch (err) {
                console.log('An error has occured with Account fetch module.');
                resolve(null);
            }
        });
        proxyReq.on('error', (err) => {
            console.log('Connection error:', err);
            resolve(null);
        });

        proxyReq.end();
    });

    if (!userid) {
        return response.send('nonnid');
    }

    const miiData = await new Promise((resolve) => {
      // Gets Mii data from pid
        const options = {
            hostname: 'account.samtendo.net',
            port: 443,
            path: `/v1/api/miis?pids=${userid}`,
            method: 'GET',
            servername: 'account.samtendo.net',
            headers: {
                'X-Nintendo-Client-ID': 'a2efa818a34fa16b8afbc8a74eba3eda',
                'X-Nintendo-Client-Secret': 'c91cdb5658bd4954ade78533a339cf9a'
            }
        };

        const proxyReq = https.request(options, (targetRes) => {
            const chunks = [];
            try {
                targetRes.on('data', (chunk) => chunks.push(chunk));

                targetRes.on('end', async() => {
                    const responseBuffer = Buffer.concat(chunks);
                    const xmlString = responseBuffer.toString('utf8');
                     
       
                const miiDataMatch = xmlString.match(/<data>(.*?)<\/data>/);
                const extractedMiiData = miiDataMatch ? miiDataMatch[1] : null;
                
                resolve({ 
                    Mii_data: extractedMiiData 
                });
                });
            } catch (err) {
                console.log('An error has occured with Account fetch module.');
                resolve(null);
            }
        });
        proxyReq.on('error', (err) => {
            console.log('Connection error:', err);
            resolve(null);
        });

        proxyReq.end();
    });
    if (!miiData || Object.keys(miiData).length === 0) {
        return response.send('nonnid');
    }
        const resPath = path.join(process.cwd(), 'assets', 'FFLResHigh.dat');
        if (!fs.existsSync(resPath)) {
            console.error(`Missing FFLResHigh.dat at: ${resPath}`);
            return response.status(500).send('Missing core assets file');
        }
        const localFflBuffer = fs.readFileSync(resPath);
        const miiDataz = miiData.Mii_data;
        const miiBuffer = Buffer.from(miiDataz, 'base64');
        const myMii = new Mii(miiBuffer); 
        
        try {
            let imageBuffer = await myMii.render(false, {
                fflResBuffer: localFflBuffer, 
                expression: expression ? parseInt(expression) : 0
            });
                if (width && width !== 64) {
        imageBuffer = await sharp(imageBuffer)
            .resize(width, width)
            .toBuffer();
    }

            response.setHeader('Content-Type', 'image/png')
            return response.send(imageBuffer);
        } catch (error) {
            console.error('Failed to render Mii:', error);
            return response.status(500).send('Render failed');
        }
            }
});
module.exports = router; 
