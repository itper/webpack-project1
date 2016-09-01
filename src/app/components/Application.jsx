import React,{Component} from 'react';
import test1 from '../../lib/1.js';
test1.hello();
export default class Application extends Component{
    render(){
        console.log(test1.hello);
        return (
            <div>123123</div> );
    }
}