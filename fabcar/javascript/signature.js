/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const nodeRsa = require("node-rsa")
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
exports.themDiem = async function (mssv,maLopHocPhan,diemmoi,public_key,signature) {
   try{  
	console.log(dinhDanh);
        // load the network configuration
        //const ccpPath = path.resolve(__dirname, '..', '..','test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(dinhDanh);
        if (userIdentity) {
            console.log(`An identity for the user "${dinhDanh}" already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }


        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'dinhDanh', discovery: { enabled: true, asLocalhost: true}});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('paper');


	const key_pub = new nodeRsa(public_key);
	
	var dec =  key_pub.decryptPublic(signature,'utf8');
	console.log(dec==);
	if(dec)
        
	await contract.submitTransaction('suaDiem',mssv, maLopHocPhan, diemmoi);
        console.log('Transaction has been submitted');

	await gateway.disconnect();
	return 'Succesfully';
   }catch(error){
	console.error(`Failed:${error}`);
	//process.exit(1);
	}
}

//let dinhDanh = 'appUser';

//main(dinhDanh);
