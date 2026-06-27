const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Contestant, connectDB } = require('./database');

// Load environment variables from the root folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbPath = path.join(__dirname, 'data.json');

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        
        if (!fs.existsSync(dbPath)) {
            console.error("data.json not found!");
            process.exit(1);
        }

        // Read data.json
        const data = fs.readFileSync(dbPath, 'utf8');
        const contestantsData = JSON.parse(data);
        
        console.log(`Found ${contestantsData.length} contestants in local data.json`);
        
        // Clear existing database to avoid duplicates
        await Contestant.deleteMany({});
        console.log("Cleared existing Mongoose collections.");
        
        // Insert new data
        await Contestant.insertMany(contestantsData);
        console.log("Successfully seeded MongoDB with local data.json!");
        console.log("You can now safely run the server using MongoDB!");
        
        process.exit(0);
    } catch (err) {
        console.error("Failed to seed database:", err);
        process.exit(1);
    }
};

seedDatabase();
