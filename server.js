// server.js

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Pusher = require('pusher')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const port = process.env.PORT || 8080
const pusher = new Pusher({
  appId: 'xxxx',
  key: 'xxxx',
  secret: 'xxxx',
  cluster: 'xxx',
  encrypted: true
})
let comments = [
  {
    author: 'robo',
    message: 'i totally didn\'t see that coming'
  }
]
/**
* receive new comment from the client
* update the comments array with the new entry
* publish update to Pusher
*/
app.post('/comment', function (req, res) {
  const {author, message} = req.body
  comments = [...[{author, message}], ...comments]
  pusher.trigger('sport-buzz-news', 'new-comment', {author, message})
  res.sendStatus(200)
})
// send all comments to the requester
app.get('/comments', function (req, res) {
  res.json(comments)
})
app.listen(port, function () {
  console.log('Node app is running at localhost:' + port)
})