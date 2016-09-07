import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import Routes from '../router'

const rootEle = document.getElementById('app');

ReactDOM.render(<Router history={browserHistory}>{Routes}</Router>, rootEle);