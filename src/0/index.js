require.ensure([],function(require){
    require('../lib/2').hello(1);//123123
});
import hello from '../lib/3';
hello();
module.exports = {};