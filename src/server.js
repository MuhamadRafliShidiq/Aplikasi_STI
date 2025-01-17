const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 9000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});