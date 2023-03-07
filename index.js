require("dotenv").config();
const app = require("./app");
const config = require("./utils/config");
const connectDatabase = require("./db/connectDB");

async function start() {
  try {
    await connectDatabase(config.MONGODB_URI);
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
