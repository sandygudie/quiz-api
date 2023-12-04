const cron = require('node-cron')
const https = require('https')

const backendUrl = 'https://quizbase.onrender.com'
const job = cron.schedule('*/14 * * * *', function () {
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('Server restarted')
      } else {
        console.error(`Failed to restart with with status code: ${res.statusCode}`)
      }
    })
    .on('error', (err) => {
      console.error(`Error during restart: ${err.message}`)
    })
})

module.exports = { job }
