const { ethers } = require('ethers');

// From backend/.env
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey);

console.log('\n===========================================');
console.log('YOUR WALLET ADDRESS:');
console.log(wallet.address);
console.log('===========================================\n');
console.log('Copy the address above and use it at these FREE faucets:\n');
console.log('1. Alchemy Faucet (Recommended):');
console.log('   https://www.alchemy.com/faucets/polygon-amoy');
console.log('   - 0.5 POL per day');
console.log('   - Login with Alchemy account\n');
console.log('2. Polygon Faucet (if GitHub works):');
console.log('   https://faucet.polygon.technology');
console.log('   - Select: Polygon Amoy + POL token\n');
console.log('3. QuickNode Faucet:');
console.log('   https://faucet.quicknode.com/polygon/amoy\n');
