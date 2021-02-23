const { default: fetch } = require('node-fetch')
const AirBridge = require('../airbridge')
module.exports = async (req, res) => {
  const {code, state: recordID} = req.query
  const user = await AirBridge.find('Authed Accounts', {filterByFormula: `RECORD_ID()='${recordID}'`})

  if (user) {
    AirBridge.patch('Authed Accounts', recordID, { 'Slack Auth Code': code })
    const tokenUrl = 'https://slack.com/api/oauth.v2.access' +
                      `?code=${code}` +
                      `&client_id=${process.env.SLACK_CLIENT_ID}` +
                      `&client_secret=${process.env.SLACK_CLIENT_SECRET}`
                      console.log({tokenUrl})
    const slackToken = await fetch(tokenUrl)
    const slackUser = await fetch('https://slack.com/api/users.identity', {
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json'
      },
    })
    res.status(200).send('It worked! You can close this tab now')
  } else {
    // oh, we're far off the yellow brick road now...
    res.status(422).send('Uh oh...')
  }
}