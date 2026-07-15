#!/bin/bash

echo "🔄 Setting up fresh election system..."
echo ""

# Step 1: Deploy contract
echo "📝 Deploying smart contract..."
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
cd ..

# Step 2: Verify deployment
echo ""
echo "✅ Verifying deployment..."
node backend/test-connection.js

echo ""
echo "🎯 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your backend server (npm run dev in backend folder)"
echo "2. Go to http://localhost:3000/electoral-officer"
echo "3. Add candidates"
echo "4. Use POST http://localhost:5000/api/election/activate to activate election"
echo "5. Go to http://localhost:3000/live-polls to see results"
