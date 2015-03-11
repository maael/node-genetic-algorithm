var genetic = require('..'),
    chai = require('chai'),
    should = chai.should();

describe('node-genetic-algorithm', function() {
    describe('z = sin(2x)*x + sin(x+y)*y, in [-pi,6*pi]', function() {
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
    describe('f = sum(i=1 to 10) x_i^2 in [-100,100]', function() {
        it('should produce a solution close to the maximum', function() {
            this.timeout(0);
            var solution = genetic(function(x){
                var sum = 0;
                for(var i = 1; i <= 10; i++) {
                    sum += x - Math.pow(i, 2);
                }
                return sum;
            }, [-100, 100], {
                parameters: ['x']
            });
            console.log(solution);
        });
    });
});