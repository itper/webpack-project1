require.ensure([],function(require){
    var hello = require('../../lib/2')();//123123
    var hello = require('../../lib/1')();//123123
})
module.exports = {};