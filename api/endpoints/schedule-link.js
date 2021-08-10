const findOrCreateMeeting = require("../find-or-create-meeting")

module.exports = async (req, res) => {
  const { query } = req

  // No scheduling link ID? Let's redirect the user to get a new one
  if (!req.query || !req.query.id) {
    res.redirect('new-schedule-link')
    return
  }

  try {
    const airtableMeeting = await findOrCreateMeeting({queryID: query.id})
    if (query.phone) {
      res.redirect('/phone.html?meetingID='+airtableMeeting.fields['Zoom ID'])
    } else {
      res.redirect(airtableMeeting.fields['Join URL'])
    }
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message)
  }
}