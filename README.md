# What does this do??
This code is a simple script made using MiiJS, you can use Mii base64 data or a SNID (Samtendo Network ID).

## Setup
run npm i to install dependencies
```js
npm i
```
And just run it!
```js
node src/server.js
or
npm run start
```
### Usage
If you want to use Mii data, do this:
```bash
http://localhost:7190/mii?Mii_data=[MiiData]&expression=[feeling_id]&width=[How much pixels big you want it]
```
If you want to use an SNID, do this:
```bash
http://localhost:7190/mii?username=[SNID_HERE]&expression=[feeling_id]&width=[How much pixels big you want it]
```
