import React, { Component } from 'react';
import { addComment, updateComment } from '../actions'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import UUID from 'uuid'

/*
* This class encapsulates a modal dialog for entering initial or editing
* existing attributes of a comment. It works in the same way as the PostModal
* class, where more details are described, which also apply to this class here.
*/

class CommentModal extends Component {
  constructor(props) {
    super(props)
    this.state = this.computeState(props.editedComment)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editedComment !== nextProps.editedComment) {
      this.setState(() => this.computeState(nextProps.editedComment))
    }
  }

  computeState(comment) {
    return {
      editedComment: comment,
      timestamp: comment && comment.timestamp,
      body: comment && comment.body,
      author: comment && comment.body,
      }
  }

  storeInput = (key, value) => {
    this.setState(() => ({ [key]: value }))
  }

  // UUID: RFC4122 128 bit (https://www.npmjs.com/package/uuid)
  storeComment = () => {
    const { editedComment, body, author, timestamp } = this.state
    const { post } = this.props
    if (editedComment.id)
      this.props.dispatch(updateComment({ id: editedComment.id, body, timestamp }))
    else
      this.props.dispatch(addComment({ id: UUID(), parentId: post.id, timestamp: Date.now(), body, author }))
  }

  /* Note: Use  || '' (in body) to avoid warning when entering 1st time a value into the field
  Warning: A component is changing an uncontrolled input of type textarea to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components
  */
  render() {
    const { handleEditingFinished } = this.props
    const { editedComment, body } = this.state
    const isOpen = editedComment != null
    const isNew = editedComment && !editedComment.id

    return (
      <div>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={isOpen}
          contentLabel='Modal'
        >
          <h3>{isNew ? 'New' : 'Edit'} Comment</h3>
          <form className="table">
            <div className="row">
              <span className="col-2">Text</span>
              <input
                className="col-9"
                type="textarea"
                value={body || ''}
                onChange={event => this.storeInput('body', event.target.value)}
                placeholder="Enter body"
              />
            </div>
            {isNew && (
            <div className="row">
              <span className="col-2">Author</span>
              <input
                className="col-9"
                type="text"
                onChange={event => this.storeInput('author', event.target.value)}
                placeholder="Enter author"
              />
            </div>
            )}
          </form>
          <button
            onClick={() => {
              this.storeComment()
              handleEditingFinished()
              }}>
            OK
          </button>
          <button onClick={handleEditingFinished}>Cancel</button>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({ post }) {
  return {
  }
}

export default connect(mapStateToProps) (CommentModal);
