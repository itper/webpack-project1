import {render} from 'react-dom';
import React from 'react';
import Application from './components/Application';
import native from '@ganji/native';
native.invoke();
window.alert($('#root'));
console.log(Application);
var url = require('./css/1.png');
console.log(url);
var log = require('@ganji/log');
log.listen();

render((
    <div>
    <Application/>
    </div>
),document.getElementById('root'));