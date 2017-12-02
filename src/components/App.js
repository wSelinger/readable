import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getCategories, getPosts } from '../actions'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import PostsList from './PostsList'
import PostDetails from './PostDetails'

/*
* Container view of the application, sets up the component views and routes,
* passing also route parameters to the corresponding components via props.
* It is also connected to redux to trigger initial fetching of data.
*
* Note: without wrapping App by withRouter, the views were not rendered at all
* when a link was clicked, even though the browser history was updated. See
* comment at the bottom of this file.
*/

class App extends Component {
  componentDidMount() {
    // Note: since both trigger asynchronous calls via thunks, they are executed in parallel
      this.props.dispatch(getCategories())
      this.props.dispatch(getPosts())
  }

  render() {
    const { categories=[], posts=[] } = this.props

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Readable</h1>
        </header>

        <Route exact path="/" render={() => (
          <div>
            <Link to="/">Home</Link>
            <CategoryLinks categories={categories} />
            <PostsList posts={posts} />
          </div>
          )}
        />

        <Route exact path="/:category" render={({ match }) => (
          <div>
            <Link to="/">Home</Link>
            <CategoryLinks categories={categories} />
            <PostsList
              posts={posts.filter(post => post.category === match.params.category)}
              category={match.params.category}
            />
          </div>
          )}
        />

        <Route path="/:category/:post_id" render={({ match, history }) => (
          <PostDetails
            postId={match.params.post_id}
            category={match.params.category}
            history={history}
          />
          )}
        />
      </div>
    );
  }
}

const CategoryLinks = ({ categories }) => {
  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map(category => (
          <div key={category.name}>
            <Link to={`/${category.name}`}>{category.name}</Link>
          </div>
        ))}
      </ul>
    </div>
  )
}

function mapStateToProps({ post, comment }) {
  return {
    categories: post.categories,
    posts: post.posts,
  }
}

// See https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
// Kommt vielleicht auch daher, dass die Links nicht innerhalb von <Route> stehen -> ausprobieren
// Oder Change via redux auslösen z.B. via Link onClick(-> state selectedCategory, oder UI state in App Component)
export default withRouter(connect(mapStateToProps) (App));
