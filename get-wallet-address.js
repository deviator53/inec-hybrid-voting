const { ethers } = require('ethers');

const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey);

console.log('Your Wallet Address:', wallet.address);
console.log('\nUse this address at: https://faucet.polygon.technology');
console.log('Select: Polygon Amoy testnet');
console.log('Token: POL');
