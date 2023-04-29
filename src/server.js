require('dotenv').config()
const app = require('./app')
const logger = require('./config/logger')
const { PORT } = require('./config/config')

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Todo
// Admin activities
