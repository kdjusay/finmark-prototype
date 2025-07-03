const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Test@1234';
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification:', isValid);
    
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
