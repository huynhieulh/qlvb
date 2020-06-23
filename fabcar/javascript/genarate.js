'use strict';

const { FileSystemWallet, Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const { KJUR, KEYUTIL } = require('jsrsasign');
const CryptoJS = require('crypto-js');
//async function main (dinhDanh,dulieu,pk){
exports.taoChuKy= async function(dulieu,pk) {
    try {
        // calculate Hash from the specified file
        //const fileLoaded = fs.readFileSync(filename, 'utf8');
        var hashToAction = CryptoJS.SHA256(dulieu).toString();
        console.log("Hash of the file: " + hashToAction);

        //const walletContents = await wallet.export(user);
        const userPrivateKey = pk;

        var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        sig.init(userPrivateKey, "");
        sig.updateHex(hashToAction);
        var sigValueHex = sig.sign();
        var sigValueBase64 = new Buffer.from(sigValueHex, 'hex').toString('base64');
        console.log("Signature: " + sigValueBase64);
	
	return sigValueBase64;
    } catch (error) {
        console.error(`Failed to create Signature: ${error}`);
        process.exit(1);
    }
}

//main('appUser','le huynh hieu', '-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgN7c35lFqE7Yhb6fD\r\nyDX+CvQT+4+z1V30fQ1LoX/ZjrShRANCAATMrDd8t9CL2LYhg05DOGQH1oFU40LR\r\nmKUGFle1OHfoqsyw6RCjIFQ72h3C4c6BbrciYvrPtnM+0cGvYIfnt3bw\r\n-----END PRIVATE KEY-----\r\n');
