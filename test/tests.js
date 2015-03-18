var genetic = require('..'),
    chai = require('chai'),
    should = chai.should(),
    fs = require('fs');
            

describe('node-genetic-algorithm', function() {
    describe('testing fitness proportionate', function() {
        it('should produce a solution close to the maximum', function() {
            this.timeout(0);
            var solution = genetic(function(x){
                var sum = 0;
                for(var i = 1; i <= 10; i++) {
                    sum += x - Math.pow(i, 2);
                }
                return sum;
            }, [-100, 100], {
                parameters: ['x'],
                selection: {method: 'fitnessProportionate', parents: 5},
                populationSize: 10
            });
            console.log(solution);
        });
    });
    describe('testing tournament', function() {
        it('should produce a solution close to the maximum', function() {
            this.timeout(0);
            var solution = genetic(function(x){
                var sum = 0;
                for(var i = 1; i <= 10; i++) {
                    sum += x - Math.pow(i, 2);
                }
                return sum;
            }, [-100, 100], {
                parameters: ['x'],
                selection: {method: 'tournament', parents: 5, tournamentSize: 2},
                populationSize: 10
            });
            console.log(solution);
        });
    });
    describe('z = sin(2x)*x + sin(x+y)*y, in [-pi,6*pi]', function() {
        it('should produce a solution close to the maximum', function() {
            this.timeout(0);
            var solution = genetic(function(x, y){
                return (Math.sin(2 * x) * x + Math.sin(x + y) * y)
            }, [-Math.PI, 6 * Math.PI], {
                parameters: ['x', 'y'],
                midAlgorithmCall: function(orderedPopulation) {
                    line = orderedPopulation[0].values[0] + ',' + orderedPopulation[0].values[1] + ',' + orderedPopulation[0].fitness + '\n';
                    fs.appendFile('sin.csv',line,function(err){
                    if(err) { throw err; }});
                },
                populationSize: 10
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
                parameters: ['x'],
                midAlgorithmCall: function(orderedPopulation) {
                    line = orderedPopulation[0].values[0] + ',' + ',' + orderedPopulation[0].fitness + '\n';
                    fs.appendFile('sum.csv',line,function(err){
                    if(err) { throw err; }});
                },
                populationSize: 10
            });
            console.log(solution);
        });
    });
});