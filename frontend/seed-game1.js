#!/usr/bin/env node

const fs = require("fs");
const axios = require("axios");
const path = require("path");

// Configuration
const BACKEND_URL =
  process.env.BACKEND_URL || process.argv[2] || "http://localhost:8080";
const GAME_FILE = "game1.json";

console.log("🌱 BrightMinds Game Seeder");
console.log("========================");

async function seedGameData() {
  try {
    // Check if game file exists
    const gameFilePath = path.join(__dirname, GAME_FILE);
    if (!fs.existsSync(gameFilePath)) {
      console.error(`❌ Error: ${GAME_FILE} not found in current directory`);
      process.exit(1);
    }

    // Read and parse game data
    console.log(`📖 Reading ${GAME_FILE}...`);
    const gameData = JSON.parse(fs.readFileSync(gameFilePath, "utf8"));

    // Validate required fields
    if (!gameData.title || !gameData.scenes) {
      console.error(
        "❌ Error: Invalid game data format. Missing required fields."
      );
      process.exit(1);
    }

    console.log(`🎮 Game: ${gameData.title}`);
    console.log(`📊 Scenes: ${gameData.scenes.length}`);
    console.log(`🔗 Backend URL: ${BACKEND_URL}`);

    // Post to backend seeder API
    console.log("\n🚀 Seeding data to backend...");
    const response = await axios.post(
      `${BACKEND_URL}/api/seeder/story`,
      gameData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("✅ Success!");
    console.log(`📝 Response: ${response.data}`);

    // Additional info
    console.log("\n📋 Summary:");
    console.log(`   • Story: ${gameData.title}`);
    console.log(`   • Type: ${gameData.gameplayType || "MCQ"}`);
    console.log(`   • Scenes: ${gameData.scenes.length}`);

    // Count assets and dialogues
    let totalAssets = 0;
    let totalDialogues = 0;
    let totalQuestions = 0;

    gameData.scenes.forEach((scene) => {
      totalAssets += scene.assets ? scene.assets.length : 0;
      totalDialogues += scene.dialogues ? scene.dialogues.length : 0;
      if (scene.question) totalQuestions++;
    });

    console.log(`   • Assets: ${totalAssets}`);
    console.log(`   • Dialogues: ${totalDialogues}`);
    console.log(`   • Questions: ${totalQuestions}`);
  } catch (error) {
    console.error("\n❌ Error seeding game data:");

    if (error.response) {
      // Server responded with error status
      console.error(`   Status: ${error.response.status}`);
      console.error(
        `   Message: ${error.response.data || error.response.statusText}`
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("   Network Error: Unable to connect to backend");
      console.error(`   URL: ${BACKEND_URL}`);
      console.error("   Make sure your backend is running and accessible");
    } else {
      // Something else happened
      console.error(`   ${error.message}`);
    }

    console.log("\n💡 Troubleshooting:");
    console.log("   1. Make sure your backend is running");
    console.log("   2. Check the backend URL is correct");
    console.log("   3. Verify the seeder endpoint is accessible");
    console.log("   4. Check backend logs for detailed error messages");

    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node seed-game1.js [BACKEND_URL]");
  console.log("");
  console.log("Arguments:");
  console.log(
    "  BACKEND_URL    Backend API URL (default: http://localhost:8080)"
  );
  console.log("");
  console.log("Environment Variables:");
  console.log("  BACKEND_URL    Backend API URL");
  console.log("");
  console.log("Examples:");
  console.log("  node seed-game1.js");
  console.log("  node seed-game1.js http://localhost:8080");
  console.log("  node seed-game1.js https://your-backend.onrender.com");
  console.log(
    "  BACKEND_URL=https://your-backend.onrender.com node seed-game1.js"
  );
  process.exit(0);
}

// Run the seeder
seedGameData();
