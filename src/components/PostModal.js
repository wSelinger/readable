import React, { Component } from 'react';
import { addPost, updatePost } from '../actions'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import UUID from 'uuid'

/*
* This class encapsulates a modal dialog for entering initial or editing
* existing attributes of a post. Upon completion, corresponding action creators
* are called and actions dispatched.
* This dialog can be used in different places by including this component and
* passing it the object to be edited or an empty object in case of creation.
* Setting the object opens the modal, resetting it to null, closes it.
* The parent is informed when the editing is finished by calling back via a
* handler function, in which the parent resets the to be edited object, thus
* closing the modal.
*/
class PostModal extends Component {
  constructor(props) {
    super(props)
    this.state = this.computeState(props.editedPost)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editedPost !== nextProps.editedPost) {
      this.setState(() => this.computeState(nextProps.editedPost))
    }
  }

  computeState(post) {
    return {
      editedPost: post,
      title: post && (post.title || ''),
      body: post && (post.body|| ''),
      author: post && (post.author || ''),
      category: post && post.category,
      }
  }

  storeInput = (key, value) => {
    this.setState(() => ({ [key]: value }))
  }

  // UUID: RFC4122 128 bit (https://www.npmjs.com/package/uuid)
  // evtl. via action ?
  storePost = () => {

    const { editedPost, category, title, body, author } = this.state
    if (editedPost.id)
      this.props.dispatch(updatePost({ id: editedPost.id, title, body }))
    else
      this.props.dispatch(addPost({
        id: UUID(),
        timestamp: Date.now(),
        /* if user does not change from default value in select box, no change event occurs and state contains empty category value */
        category: category || this.props.categories[0].name,
        title,
        body,
        author }))
  }

  /* Note: Use  || '' (in title and body) to avoid warning when entering 1st time a value into the field
  Warning: A component is changing an uncontrolled input of type textarea to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components
  */
  render() {
    const { categories, handleEditingFinished } = this.props
    const { editedPost, title, body } = this.state
    const isOpen = editedPost != null
    const isNew = editedPost && !editedPost.id

    return (
      <div>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={isOpen}
          contentLabel='Modal'
        >
          <h3>{isNew ? 'New' : 'Edit'} Post</h3>
          <form className="table">
            {isNew && (
            <div className="row">
              <span className="col-2">Category</span>
              <select
                className="col-9"
                onChange={event => this.storeInput('category', event.target.value)}
                >
                {categories.map((category)=> (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          )}
            <div className="row">
              <span className="col-2">Title</span>
              <input
                className="col-9"
                type="text"
                value={title || ''}
                onChange={event => this.storeInput('title', event.target.value)}
                placeholder="Enter title"
              />
            </div>
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
              this.storePost()
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
    categories: post.categories,
  }
}

export default connect(mapStateToProps) (PostModal);
