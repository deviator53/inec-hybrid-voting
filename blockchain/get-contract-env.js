// Helper script to extract contract info for environment variables
const fs = require('fs');
const path = require('path');

try {
  // Read deployment info
  const deploymentPath = path.join(__dirname, 'deployment.json');
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

  // Read contract ABI
  const artifactPath = path.join(
    __dirname,
    'artifacts/contracts/ElectorateVoting.sol/ElectorateVoting.json'
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  console.log('\n=== CONTRACT ENVIRONMENT VARIABLES ===\n');
  console.log('VOTING_CONTRACT_ADDRESS=');
  console.log(deployment.address);
  console.log('\nCONTRACT_ABI=');
  console.log(JSON.stringify(artifact.abi));
  console.log('\n=== Copy these to your Render environment variables ===\n');
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nMake sure you have:');
  console.log('1. deployed the contract (deployment.json exists)');
  console.log('2. compiled the contract (artifacts folder exists)');
}
