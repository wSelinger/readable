import React, { Component } from 'react';
import { voteForPost, deletePost } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PostModal from './PostModal'

/*
* This class implements a UI component managing a list of posts displayed in the
* Home and Category views.
* A property 'props' is used to pass the posts. The parent component selects
* the posts.
* The component also includes buttons for creating a new post, as well as
* actions on the listed posts - voting, editing and deletion.
* Editing and entering a new post is delegated to a component representing a modal.
*
* The component manages UI state which includes the selected list sort order
* and a variable for controlling the post creation/editing modal via a prop of
* the modal.
*
* Actions triggered by the user on one of the posts are created by calling the
* the creators and dispatched using the dispatch function received upon
* connecting to redux.
*/

class PostsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editedPost: null,
      comparatorIndex: 0
    }

    this.comparators = [
      {
        name: 'VoteScore (highest first)',
        comp: (a, b) => b.voteScore - a.voteScore
      },
      {
        name: 'Timestamp (highest first)',
        comp: (a, b) => b.timestamp - a.timestamp
      },
      {
        name: 'Category',
        comp: (a, b) => a.category.localeCompare(b.category)
      },
    ]
  }

  handleComparatorSelected = (comparatorIndex) => {
    this.setState(() => ({ comparatorIndex: comparatorIndex }))
  }

  openCreatePostModal = () => {
    const emptyPost = {}
    this.handleEditPost(emptyPost)
  }

  handleEditPost = (post) => {
    this.setState(() => ({ editedPost: post }))
  }

  handleEditingFinished = () => {
    this.setState(() => ({ editedPost: null }))
  }

  handlePostVote = (id, isUpVote) => {
    this.props.dispatch(voteForPost(id, isUpVote))
  }

  handleDeletePost = (id) => {
    this.props.dispatch(deletePost(id))
  }

  render() {
    const { posts } = this.props
    const { editedPost, comparatorIndex } = this.state
    const selectedComparator = this.comparators[comparatorIndex].comp
    return (
      <div>
        <h2>Posts</h2>
        <button onClick={this.openCreatePostModal}>New Post</button>
        <div className="col-10 right">
          <span>Sort by:</span>
          <select
            onChange={event => this.handleComparatorSelected(event.target.value)}
            value={comparatorIndex}
            >
            {this.comparators.map((comp, index)=> (
              <option key={index} value={index}>{comp.name}</option>
            ))}
          </select>
        </div>
        <Posts
          posts={posts.slice().sort(selectedComparator)}
          handlePostVote={this.handlePostVote}
          handleDeletePost={this.handleDeletePost}
          handleEditPost={this.handleEditPost}
        />
        <PostModal
          editedPost={editedPost}
          handleEditingFinished={this.handleEditingFinished}
        />
      </div>
    )
  }
}

// map just for props.dispatch
function mapStateToProps({ post, comment }) {
  return {
  }
}

export default connect(mapStateToProps) (PostsList);

const Posts = ({ posts, handlePostVote, handleDeletePost, handleEditPost }) => {
  return (
    <div className="table">
      {posts.length > 0 && (
      <div className="row">
          <span className="col-4">Title</span>
          <span className="col-1">Posted</span>
          <span className="col-1">Category</span>
          <span className="col-1 right"># comments</span>
          <span className="col-1 right">Vote-Score</span>
      </div>
      )}
      {posts.map(post => (
        <div key={post.id} className="row">
          <Link to={`/${post.category}/${post.id}`} className="post-row-link">
            <span className="col-4">{post.title}</span>
            <span className="col-1">{new Date(post.timestamp).toLocaleDateString()}</span>
            <span className="col-1">{post.category}</span>
            <span className="col-1 right">{post.commentCount}</span>
            <span className="col-1 right">{post.voteScore}</span>
          </Link>
          <div className="col-3 right">
            <button className="voteUp" onClick={() => handlePostVote(post.id, true)}>Vote up</button>
            <button className="voteDown" onClick={() => handlePostVote(post.id, false)}>Vote down</button>
            <button className="edit" onClick={() => handleEditPost(post)}>Edit</button>
            <button className="delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        </div>
      ))
      }
    </div>
  )
}
