import React,{Component} from 'react';
import style from '../css/global.css';
function onclick(){
    console.log(123);
}
export default class Application1 extends Component{
    render(){
        console.log(1);
        return (
            <div className={style.c1} onClick={onclick}>123123123 d</div> );
    }
}