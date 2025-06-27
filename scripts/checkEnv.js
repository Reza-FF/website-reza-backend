// scripts/checkEnv.js
const dotenv = require('dotenv');
dotenv.config();

console.log('🔍 Checking environment variables...');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ EXISTS' : '❌ MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || 5000);

if (!process.env.JWT_SECRET) {
  console.log('❌ JWT_SECRET is missing!');
  console.log('🔧 Creating .env file...');
  
  const fs = require('fs');
  const envContent = `JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created! Please restart the server.');
} else {
  console.log('✅ Environment variables are OK');
}