require.ensure([],function(require){
    var hello = require('../lib/2')(1);//123123
})
require.ensure([],function(require){
    var hello = require('../lib/1')();//123123
    
})
module.exports = {};