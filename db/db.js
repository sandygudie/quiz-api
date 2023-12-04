const mongoose = require('mongoose')
const logger = require('../config/logger')
const { MONGODB_URI } = require('../config/config')

const connectToDB = async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => {
      logger.info('Database connected successfully')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

module.exports = { connectToDB, disconnectDB }
