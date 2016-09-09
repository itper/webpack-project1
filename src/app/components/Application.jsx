import React,{Component} from 'react';
import style from '../css/global.module_css';
import '../css/global.css';
function onclick(){
    console.log(123);
}
class Application1 extends Component{
    render(){
        console.log(1);
        return (
            <div>
            <div className={style.c1} onClick={onclick}>1 d</div> 
            <div className='c1' onClick={onclick}>2 d</div> 
            </div>);
    }
}
export default Application1;