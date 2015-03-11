var genetic = require('..'),
    chai = require('chai'),
    should = chai.should();

describe('node-genetic-algorithm', function() {
    describe('sin test', function() {
        genetic(function(x, y){
            return (Math.sin(2 * x) * x + Math.sin(x + y) * y)
        }, [-Math.PI, 6 * Math.PI], {
            parameters: ['x', 'y']
        });
    });
});