/*
* API client.
* NOTE: Assumes that API server runs at http://localhost:3001
*/

const serviceUrl = "http://localhost:3001"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

const postHeaders = {
  ...headers,
  'Content-Type': 'application/json'
}

/*
  Returns a Promise of an array of categories.
  Category is defined as:
    name: String
    path: String
*/
export function getCategories() {
  return fetch(`${serviceUrl}/categories`, {headers})
      // Reminder: json() returns a Promise
    .then(res => res.json())
    .then(json => json.categories)
}

/*
  Returns a Promise of an array of posts.
  Post is defined as: (Attribute	Type	Description)
    id	String	Unique identifier
    timestamp	Integer	Time created - default data tracks this in Unix time. You can use Date.now() to get this number
    title	String	Post title
    body	String	Post body
    author	String	Post author
    category	String	Should be one of the categories provided by the server
    voteScore	Integer	Net votes the post has received (default: 1)
    deleted	Boolean	Flag if post has been 'deleted' (inaccessible by the front end), (default: false)
*/
export function getPosts() {
  return fetch(`${serviceUrl}/posts`, {headers})
  // Note: API returns already an array, not a plain Javascript object
    .then(res => res.json())
}

export function addPost(post) {
  return fetch(`${serviceUrl}/posts`, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify(post)
  }).then(res => res.json())
}

export function updatePost(post) {
  const { id, title, body } = post
  return fetch(`${serviceUrl}/posts/${id}`, {
    method: 'PUT',
    headers: postHeaders,
    body: JSON.stringify({ title, body })
  }).then(res => res.json())
}


export function deletePost(id) {
  return fetch(`${serviceUrl}/posts/${id}`, {
    method: 'DELETE',
    headers
  }).then(res => res.json())
}

export function votePost(id, isUpVote) {
  return fetch(`${serviceUrl}/posts/${id}`, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify({ option: isUpVote ? 'upVote' : 'downVote'})
  }).then(res => res.json())
}

export function getComments(postId) {
  return fetch(`${serviceUrl}/posts/${postId}/comments`, {headers})
  // Note: API returns already an array, not a plain Javascript object
    .then(res => res.json())
}

export function addComment(comment) {
  return fetch(`${serviceUrl}/comments`, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify(comment)
  }).then(res => res.json())
}

export function updateComment(comment) {
  const { id, timestamp, body } = comment
  return fetch(`${serviceUrl}/comments/${id}`, {
    method: 'PUT',
    headers: postHeaders,
    body: JSON.stringify({ timestamp, body })
  }).then(res => res.json())
}


export function deleteComment(id) {
  return fetch(`${serviceUrl}/comments/${id}`, {
    method: 'DELETE',
    headers
  }).then(res => res.json())
}

export function voteComment(id, isUpVote) {
  return fetch(`${serviceUrl}/comments/${id}`, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify({ option: isUpVote ? 'upVote' : 'downVote'})
  }).then(res => res.json())
}
