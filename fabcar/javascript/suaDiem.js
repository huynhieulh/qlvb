/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
var moduleValid = require('./validate.js');

exports.changePoint= async function(mssv,ki,maLopHocPhan,diemmoi,dinhdanh, signature) {
//  async function main() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(dinhdanh);
        if (!identity) {
            console.log(`An identity for the user ${dinhdanh} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: dinhdanh, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');




        // Get the contract from the network.
        const contract = network.getContract('paper');

	const data = mssv+ki+maLopHocPhan+diemmoi+dinhdanh
	if(moduleValid.validate(dinhdanh, data, signature) == true){
		 await contract.submitTransaction('choDiem',mssv,ki, maLopHocPhan, diemmoi,dinhdanh, signature );
		 console.log('Transaction has been submitted');

		// Disconnect from the gateway.
		await gateway.disconnect();
		response ='Nhap diem thanh cong! ';
		return response;
	}else{
		await gateway.disconnect();
		response ='Ban da nhap sai khoa rieng! ';
		return response;
	}

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message
       // return response
        process.exit(1);
        return error;
    }
}
let mssv='B1609548';
let maLopHocPhan='CT173-01'
let diemmoi='8'
let dinhdanh='appUser';
let signature ='MEQCIDMKt/YBGtgplYU73XvSDoiXfarBSoTAiI/WExxqN5GTAiA/bwcmMyID4gMzvNjuTddpDHIDVP2nvBa2+qVf0a0Lxg==';
//main(mssv,'1',maLopHocPhan, diemmoi, dinhdanh, signature);
