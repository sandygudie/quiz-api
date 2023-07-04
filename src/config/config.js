if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  require('dotenv').config({ path: '.env.local' })
}

const { PORT } = process.env

const { MONGODB_URI } = process.env

module.exports = {
  MONGODB_URI,
  PORT
}

// separate development DB from production DB