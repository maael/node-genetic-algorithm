var genetic = require('..'),
    chai = require('chai'),
    should = chai.should();

describe('node-genetic-algorithm', function() {
    describe('Math.sin(2 * x) * x + Math.sin(x + y) * y max between -pi, 6pi', function() {
        it('should produce a solution close to the maximum', function() {
            this.timeout(0);
            var solution = genetic(function(x, y){
                return (Math.sin(2 * x) * x + Math.sin(x + y) * y)
            }, [-Math.PI, 6 * Math.PI], {
                parameters: ['x', 'y']
            });
            console.log(solution);
        });
    });
});