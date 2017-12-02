/*
* This module includes all action creators for the readable app.
* Most actions are thunks which require the redux-thunk middleware.
* These actions call the server api and pass on the server response
* by dispatching actions which contain the server response as payload.
*/

import * as Api from '../utils/api'

export const SET_CATEGORIES = 'SET_CATEGORIES'
export const SET_POSTS = 'SET_POSTS'
export const ADDED_POST = 'ADDED_POST'
export const UPDATED_POST = 'UPDATED_POST'
export const SET_COMMENTS = 'SET_COMMENTS'
export const ADDED_COMMENT = 'ADDED_COMMENT'
export const UPDATED_COMMENT = 'UPDATED_COMMENT'
export const DELETED_COMMENT = 'DELETED_COMMENT'

//async action creator
export function getCategories() {
  return (dispatch) => {
    Api
      .getCategories()
      .then(categories => dispatch(setCategories(categories)))
  }
}

export function setCategories(categories) {
  return {
    type: SET_CATEGORIES,
    categories
  }
}

//async action creator
export function getPosts() {
  return (dispatch) => {
    Api
      .getPosts()
      .then(posts => dispatch(setPosts(posts)))
  }
}

export function setPosts(posts) {
  return {
    type: SET_POSTS,
    posts
  }
}

//async action creator
export function addPost(post) {
  return (dispatch) => {
    Api
      .addPost(post)
      .then(post => dispatch(addedPost(post)))
  }
}

export function addedPost(post) {
  return {
    type: ADDED_POST,
    post
  }
}

//async action creator
export function updatePost(post) {
  return (dispatch) => {
    Api
      .updatePost(post)
      .then(post => dispatch(updatedPost(post)))
  }
}

//async action creator
export function voteForPost(id, isUpVote) {
  return (dispatch) => {
    Api
      .votePost(id, isUpVote)
      .then(post => dispatch(updatedPost(post)))
  }
}

//async action creator
export function deletePost(id) {
  return (dispatch) => {
    Api
      .deletePost(id)
      .then(post => dispatch(updatedPost(post)))
  }
}

export function updatedPost(post) {
  return {
    type: UPDATED_POST,
    post
  }
}

//async action creator
export function getComments(postId) {
  return (dispatch) => {
    Api
      .getComments(postId)
      .then(comments => dispatch(setComments(postId, comments)))
  }
}

export function setComments(postId, comments) {
  return {
    type: SET_COMMENTS,
    postId,
    comments
  }
}

//async action creator
export function voteForComment(id, isUpVote) {
  return (dispatch) => {
    Api
      .voteComment(id, isUpVote)
      .then(comment => dispatch(updatedComment(comment)))
  }
}

export function updatedComment(comment) {
  return {
    type: UPDATED_COMMENT,
    comment
  }
}

export function deletedComment(comment) {
  return {
    type: DELETED_COMMENT,
    comment
  }
}


//async action creator
export function addComment(comment) {
  return (dispatch) => {
    Api
      .addComment(comment)
      .then(comment => dispatch(addedComment(comment)))
      //Note: this event is also used by the post reducer to update commentCount
  }
}

export function addedComment(comment) {
  return {
    type: ADDED_COMMENT,
    comment
  }
}

//async action creator
export function updateComment(comment) {
  return (dispatch) => {
    Api
      .updateComment(comment)
      .then(comment => dispatch(updatedComment(comment)))
  }
}

//async action creator
export function deleteComment(id) {
  return (dispatch) => {
    Api
      .deleteComment(id)
      .then(comment => dispatch(deletedComment(comment)))
      //Note: this event is also used by the post reducer to update commentCount
  }
}
