import findOrCreateMeeting from "../find-or-create-meeting.js"

export default async (req, res) => {
  const { query } = req

  // No scheduling link ID? Let's redirect the user to get a new one
  if (!req.query || !req.query.id) {
    res.redirect('new-schedule-link')
    return
  }

  try {
    const airtableMeeting = await findOrCreateMeeting(query.id)
    if (query.phone) {
      res.redirect('/phone.html?meetingID='+airtableMeeting.zoomID)
    } else {
      res.redirect(airtableMeeting.joinURL)
    }
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message)
  }
}
