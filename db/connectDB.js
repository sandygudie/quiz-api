const mongoose = require('mongoose')

async function connectDatabase(url) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })
}

module.exports = connectDatabase
