import React, { Component } from 'react';
import { voteForPost, deletePost, getComments, voteForComment, deleteComment } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PostModal from './PostModal'
import CommentModal from './CommentModal'

/*
* This class implements the post details view including the list of comments
* belonging to the displayed post.
* Editing the post and creating/editing comments is delegated to components managing a modal.
*
* Input property: post id
* UI state is used to control opening and closing the post and comment modals
* via props: Setting the post or comment prop triggers opening of the modal,
* resetting it closes the modal.
*
* Data flows:
* Various (typically asynchronous) actions are dispatched to the redux store.
* Action for fetching of the post's comments is triggered from componentDidMount.
* Props for post and comments are connected to the redux store, using the input
* property postId to select the corresponding post from the store's state.
*/

class PostDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editedPost: null,
      editedComment: null
    }
  }

  componentDidMount() {
      if (this.props.postId) {
        this.props.dispatch(getComments(this.props.postId))
      }
  }

  handleEditPost = (post) => {
    this.setState(() => ({ editedPost: post }))
  }

  handleEditingPostFinished = () => {
    this.setState(() => ({ editedPost: null }))
  }

  handleDeletePost = (id) => {
    this.props.dispatch(deletePost(id))
    this.props.history.goBack()
  }

  handlePostVote = (id, isUpVote) => {
    this.props.dispatch(voteForPost(id, isUpVote))
  }

  openCreateCommentModal = () => {
    const emptyComment = {}
    this.handleEditComment(emptyComment)
  }

  handleEditComment = (comment) => {
    this.setState(() => ({ editedComment: comment }))
  }

  handleEditingCommentFinished = () => {
    this.setState(() => ({ editedComment: null }))
  }


  handleDeleteComment = (id) => {
    this.props.dispatch(deleteComment(id))
  }

  handleCommentVote = (id, isUpVote) => {
    this.props.dispatch(voteForComment(id, isUpVote))
  }

  render() {
    const { postId, post, comments } = this.props
    const { editedPost, editedComment } = this.state
    if (!post)
      return (
        <div>
          <p>Post not found (id={postId})</p>
          <Link to="/">Home</Link>
        </div>
      )

    const byVoteScoreDesc = (a, b) => b.voteScore - a.voteScore
    const timestampAsDate = new Date(post.timestamp)
    return (
      <div>
        <Link to="/">Home</Link>
        <h3>Details for post '{post.title}'</h3>
        <div className="table">
          <div className="col-12">
            <span>{post.body}</span>
          </div>
          <div className="col-6">
            <span>Author: </span>
            <span>{post.author}</span>
          </div>
          <div className="col-6">
            <span>Posted: </span>
            <span>{timestampAsDate.toLocaleDateString()} {timestampAsDate.toLocaleTimeString()}</span>
          </div>
          <div className="col-6">
            <button onClick={() => this.handleEditPost(post)}>Edit</button>
            <button onClick={() => this.handleDeletePost(post.id)}>Delete</button>
          </div>

          <div className="col-6">
            <span>Vote score: </span><span>{post.voteScore}</span>
            <button onClick={() => this.handlePostVote(post.id, true)}>Vote up</button>
            <button onClick={() => this.handlePostVote(post.id, false)}>Vote down</button>
          </div>
        </div>

        <h3>Comments ({post.commentCount})</h3>
        <button onClick={this.openCreateCommentModal}>New Comment</button>
        <div className="table">
          {comments.length > 0 && (
          <div className="row">
            <span className="col-1">Posted</span>
            <span className="col-1">Author</span>
            <span className="col-6">Text</span>
            <span className="col-1 right">Vote-Score</span>
          </div>
          )}
        {sorted(comments, byVoteScoreDesc).map((comment) => (
          <div key={comment.id} className="row">
            <span className="col-1">{new Date(comment.timestamp).toLocaleDateString()}</span>
            <span className="col-1">{comment.author}</span>
            <span className="col-6">{comment.body}</span>
            <span className="col-1 right">{comment.voteScore}</span>
            <div className="col-3 right">
              <button onClick={() => this.handleCommentVote(comment.id, true)}>Vote up</button>
              <button onClick={() => this.handleCommentVote(comment.id, false)}>Vote down</button>
              <button onClick={() => this.handleEditComment(comment)}>Edit</button>
              <button onClick={() => this.handleDeleteComment(comment.id)}>Delete</button>
            </div>
          </div>
        ))}
        </div>

        <PostModal
          editedPost={editedPost}
          handleEditingFinished={this.handleEditingPostFinished}
        />

        <CommentModal
          post={post}
          editedComment={editedComment}
          handleEditingFinished={this.handleEditingCommentFinished}
        />
      </div>
    )
  }
}

function sorted(array, comparator) {
  return array.slice().sort(comparator);
}

function mapStateToProps({ post, comment }, props) {
  const { postId }  = props
  return {
    post: post.posts && post.posts.find((post) => post.id === postId),
    comments: comment.comments[postId] || []
  }
}

export default connect(mapStateToProps) (PostDetails);
