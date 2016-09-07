import React from 'react'
import {Route, IndexRoute, Link } from 'react-router'
import DetailsPage from './information/container/detailsPage'

const App = ({ children }) => (
  <div>
    <header>
      Links:
      {' '}
      <Link to="/">Home</Link>
      {' '}
      <Link to="/foo">Foo</Link>
      {' '}
      <Link to="/bar">Bar</Link>
    </header>
    {children}
  </div>
)

const Home = () => (<div>Home!asdfasf</div>)
const Foo = () => (<div>Foo!</div>)
const Bar = () => (<div>Bar!</div>)

const routes = (
		<Route path="/">
			<IndexRoute component={Home}/>	
			<Route path='information' component={DetailsPage} />
		</Route>
)

export default routes;