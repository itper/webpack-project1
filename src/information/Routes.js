import React from 'react'
import {Router, Route } from 'react-router'
import DetailsPage from './container/DetailsPage'

const routes = (
	<Router >
	    <Route path='/'>
	        <Route path='information' component={DetailsPage} />
	    </Route>
	</Router>
);

export default routes;