import {render} from 'react-dom';
import React from 'react';
import Application from './components/Application.jsx';

import Hello from 'hello';
Hello();
console.log(Application);

render((
    <div>
    <Application/>
    </div>
),document.getElementById('root'));