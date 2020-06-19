'use strict';

const { FileSystemWallet, Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');

//async function main(dinhDanh, dulieu, signature) {
exports.validate = async function(dinhDanh, dulieu, signature)
    try {

	const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);



        // Collect input parameters
        // user: who initiates this query, can be anyone in the wallet
        // filename: the file to be validated
        // certfile: the cert file owner who signed the document
        //const user = dinhDanh;
        //const filename = process.argv[3];
        //const certfile = process.argv[4];

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(dinhDanh);
        if (!userIdentity) {
            console.log(`An identity for the user "${dinhDanh}" not in the wallet`);
            return;
        }

        // calculate Hash from the file
        const fileLoaded = dulieu;
        var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        console.log("Hash of the file: " + hashToAction);

        // get certificate from the certfile
        const certLoaded = userIdentity.credentials.certificate;

        // retrieve record from ledger

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: dinhDanh, discovery: { enabled: true, asLocalhost: true}});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('paper');

        /*// Submit the specified transaction.
        const result = await contract.evaluateTransaction('queryDocRecord', hashToAction);
        console.log("Transaction has been evaluated");
        var resultJSON = JSON.parse(result);
        console.log("Doc record found, created by " + resultJSON.time);
        console.log("");

        // Show info about certificate provided
        const certObj = new X509();
        certObj.readCertPEM(certLoaded);
        console.log("Detail of certificate provided")
        console.log("Subject: " + certObj.getSubjectString());
        console.log("Issuer (CA) Subject: " + certObj.getIssuerString());
        console.log("Valid period: " + certObj.getNotBefore() + " to " + certObj.getNotAfter());
        console.log("CA Signature validation: " + certObj.verifySignature(KEYUTIL.getKey(caCert)));
        console.log("");*/
	
	//var hashToAction = CryptoJS.SHA256(dulieu).toString();
        // perform signature checking
	var userPublicKey = KEYUTIL.getKey(certLoaded);
        var recover = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        recover.init(userPublicKey);
        recover.updateHex(hashToAction);
        var getBackSigValueHex = new Buffer.from(signature, 'base64').toString('hex');
        console.log("Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
        //console.log("Signature verified with certificate provided: " + kq);

        // perform certificate validation
        // var caPublicKey = KEYUTIL.getKey(caCert);
        // var certValidate = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        // certValidate.init(caPublicKey);
        // certValidate.update

        // Disconnect from the gateway.
        await gateway.disconnect();
	return recover.verify(getBackSigValueHex); 

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

//main('ptcang','le huynh hieu',"MEUCIQD1x+vCgDqLLSw9gRAFvEoFkf64gOTiVvnMHRpAW/5Q1AIgefh87KMmVCD/16IoP49aabS4c6udfK0y5F8SpxaTHmc=");
