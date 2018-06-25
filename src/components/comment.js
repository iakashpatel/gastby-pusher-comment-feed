// src/components/comment.js

import React, { Component } from 'react'
import CommentList from './comment-list'
import Pusher from 'pusher-js'
/**
* initialize pusher with your credentials.
* Get 'key' from pusher dashboard
*/

const pusher = new Pusher('key_of_pusher_app', {
  cluster: 'xxx',
  encrypted: true
})
// subscribe your pusher instance to the channel 'sport-buzz-news' .. fluttering-apple-749
const channel = pusher.subscribe('sport-buzz-news')
/* global fetch */
export default class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      author: '',
      message: ''
    }
  }
/**
* This will load components from the server on app startup,
* and also subscribe our app to listen for updates
*/
  async componentDidMount () {
    const comments = await fetch('http://localhost:8080/comments').then(res => res.json())
    this.setState({comments: [...comments, ...this.state.comments]})
    this.receiveUpdateFromPusher()
  }
  componentWillUnmount () {
    pusher.unsubscribe('sport-buzz-news')
  }
  /**
  * add new comments to the top of the list
  * once there's an update
  */
  receiveUpdateFromPusher () {
    channel.bind('new-comment', comment => {
      this.setState({
        comments: [comment, ...this.state.comments]
      })
    })
    console.log('app subscription to event successful')
  }
  handleChange (type, event) {
    if (type === 'author') {
      this.setState({author: event.target.value})
      return
    }
    if (type === 'message') {
      this.setState({message: event.target.value})
    }
  }
  /**
  * post comment to the server
  */
  async postComment (author, message) {
    await fetch('http://localhost:8080/comment', {
      body: JSON.stringify({author, message}),
      method: 'POST',
      headers: {
        'user-agent': 'Mozilla/4.0 ',
        'content-type': 'application/json'
      }
    })
  }
  handleSubmit (event) {
    event.preventDefault()
    this.postComment(this.state.author, this.state.message)
    this.setState({author: '', message: ''})
  }
  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label>
          Name:
            <input type='text' value={this.state.author} onChange={this.handleChange.bind(this, 'author')} />
          </label>
          <label>
            <br />
          Message:
            <textarea type='text' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} />
          </label>
          <br />
          <input type='submit' value='Submit' />
        </form>
        <CommentList comments={this.state.comments} />
      </div>
    )
  }
}