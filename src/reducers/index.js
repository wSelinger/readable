/*
* This module includes 2 reducers, one for posts and one for comments.
* One special case is the usage of comment actions in the post reducer.
* This scheme is used to update the commentCount in case of creation or
* deletion of comments.
*
* Note: Posts and comments marked as deleted are already filtered by the reducers so the
* UI components do not even see deleted objects.
*/

import { combineReducers } from 'redux'
import {
    SET_CATEGORIES,
    SET_POSTS,
    ADDED_POST,
    UPDATED_POST,
    SET_COMMENTS,
    ADDED_COMMENT,
    UPDATED_COMMENT,
    DELETED_COMMENT,
} from '../actions'

// post reducer

function post(state = { categories: [] }, action) {
  switch (action.type) {

    case SET_CATEGORIES:
      const { categories } = action
      return {
        ...state,
        categories
      }

    case SET_POSTS:
      const { posts } = action
      return {
        ...state,
        posts: posts.filter((post) => !post.deleted)
      }

    case ADDED_POST:
      const { post } = action
      return {
        ...state,
        posts: state.posts.concat(post)
      }

    case UPDATED_POST:
      const updated = action.post
      const newPosts =
        updated.deleted ?
          state.posts.filter((post) => post.id !== updated.id) :
          state.posts.map((post) => post.id === updated.id ? updated : post)
      return {
        ...state,
        posts: newPosts
      }

      /*
      Update commentCount in case of addition or deletion of comment.
      A possible, simpler alternative is to re-read the post from the server
      in this case.
      */
      case ADDED_COMMENT:
        return updateCommentCount(state, action, 1)

      case DELETED_COMMENT:
        return updateCommentCount(state, action, -1)

    default:
      return state
  }
}

function updateCommentCount(state, action, deltaCount) {
  const postId = action.comment.parentId
  const newPosts = state.posts.map((post) => (
    post.id === postId ? {
      ...post,
      commentCount: post.commentCount + deltaCount
    } : post
  ))
  return {
    ...state,
    posts: newPosts
  }
}

// comment reducer

function comment(state = { comments: {}}, action) {
  switch (action.type) {

    case SET_COMMENTS:
      const { postId, comments } = action
      return {
        ...state,
        comments: {
          ...state.comments,
          [postId]: comments
        }
      }

    case ADDED_COMMENT: {
      const { comment } = action
      const postId = comment.parentId
      const comments = state.comments[postId] || []

      return {
        ...state,
        comments: {
          ...state.comments,
          [postId]: comments.concat(comment)
        }
      }
    }

    case DELETED_COMMENT:
    case UPDATED_COMMENT: {
      const updated = action.comment
      const postId = updated.parentId
      const comments = state.comments[postId] || []
      const newComments =
        action.type === DELETED_COMMENT ?
          comments.filter((comment) => comment.id !== updated.id) :
          comments.map((comment) => comment.id === updated.id ? updated : comment)
      return {
        ...state,
        comments: {
          ...state.comments,
          [postId]: newComments
        }
      }
    }

    default:
      return state
  }
}

export default combineReducers({
  post,
  comment,
})
