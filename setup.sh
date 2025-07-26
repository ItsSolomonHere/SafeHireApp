#!/bin/bash

echo "🚀 SafeHire Kenya - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
npm install

if [ $? -eq 0 ]; then
    echo "✅ Server dependencies installed successfully"
else
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd ../client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Client dependencies installed successfully"
else
    echo "❌ Failed to install client dependencies"
    echo "💡 Try running: npm install --legacy-peer-deps"
    exit 1
fi

# Create .env file if it doesn't exist
echo ""
echo "🔧 Setting up environment variables..."
cd ../server
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safehire-kenya
JWT_SECRET=safehire-kenya-jwt-secret-key-2024
NODE_ENV=development
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB (if using local database)"
echo "2. Run the server: cd server && npm run dev"
echo "3. Run the client: cd client && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔗 API will be available at: http://localhost:5000"
echo "🌐 Frontend will be available at: http://localhost:3000" 