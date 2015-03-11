var genetic = (function (f, range, options) {
	options = options || {};
	options.parameters = options.parameters || ['x'];
	options.populationSize = options.populationSize || 1000;
	options.method = options.method || 'both';
	options.mutationRate = options.mutationRate || 0.1;
	options.selection = options.selection || {method: 'truncation', number: 5};
	options.maxGenerations = options.maxGenerations || 10000;
	options.termination = options.termination;
	var generation = 0;
	function fitnessOrder(a, b) {
		if(a.fitness > b.fitness) { return -1; }
		if(a.fitness < b.fitness) { return 1; }
		return 0;
	}
	function initializeRandomPopulation(parameters, populationSize, range) {
		var population = [];
		for(var i = 0; i < populationSize; i++) {
			var individual = {values: [], fitness: 0};
			for(var j = 0; j < parameters.length; j++) {
				individual.values.push(Math.random() * (range[1] - range[0] + 1) + range[0]);
			}
			population.push(individual);
		}
		return population;
	}
	function evaluatedPopulation(population, f) {
		var evaluatedPopulation = [];
		for(var i = 0; i < population.length; i++) {
			population[i].fitness = f.apply(null, population[i].values);
		}
		return population;
	}
	function createNewPopulation(parents, populationSize, mutationRate) {
		var population = [];
		function mutation(parent, rate) {
			var child = {values: [], fitness: 0};
			for(var i = 0; i < parent.values.length; i++) {
				var mutation = (Math.random() * (1 - 0 + 1) + 0) * rate;
				child.values.push(parent.values[i] + mutation);
			}
			return child;
		}
		generation++;
		var parentIndex = 0;
		while(population.length < populationSize) {
			var parent = parents[parentIndex];
			population.push(mutation(parent, mutationRate));
			parentIndex++;
			parentIndex = (parentIndex + 1) % (parents.length - 1);
		}
		return population;
	}
	function selectParents(population, method) {
		var parents = [];
		if(method.method === 'truncation') {
			population.sort(fitnessOrder);
			parents = population.slice(0, method.number);
		}
		return parents;
	}
	function terminationCheck(population, maxGenerations, termination) {
		if(generation >= maxGenerations) {
			return true;
		} else {
			return false;
		}
	}
	var population = initializeRandomPopulation(options.parameters, options.populationSize, range);
	while(true) {
		population = evaluatedPopulation(population, f);
		population.sort(fitnessOrder);
		var popFitness = 0;
		for(var i = 0; i < population.length; i++) {
			popFitness += population[i].fitness;
		}
		console.log('Generation ' + generation + ' | Average Fitness: ' + (popFitness / population.length));
		if(terminationCheck(population, options.maxGenerations, options.termination)) { break; }
		var parents = selectParents(population, options.selection);
		var parentFitness = 0;
		for(var i = 0; i < parents.length; i++) {
			parentFitness += parents[i].fitness;
		}
		console.log('Generation ' + generation + ' parents |  Average Fitness: ' + (parentFitness / parents.length));
		population = createNewPopulation(parents, options.populationSize, options.mutationRate);
	}});

genetic(function(x, y){
	return (Math.sin(2 * x) * x + Math.sin(x + y) * y)
}, [-Math.PI, 6 * Math.PI], {
	parameters: ['x', 'y']
});