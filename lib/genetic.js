var genetic = (function (f, range, options) {
	options = options || {};
	options.parameters = options.parameters || ['x'];
	options.populationSize = options.populationSize || 10000;
	options.method = options.method || 'both';
	options.mutationRate = options.mutationRate || 0.01;
	options.selection = options.selection || {method: 'truncation', parents: 5};
	options.maxGenerations = options.maxGenerations || 1000;
	options.termination = options.termination;
	options.midAlgorithmCall = options.midAlgorithmCall || function () {};
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
				var mutation = (Math.random() * (1 - (-1) + 1) + (-1)) * rate;
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
			parents = population.slice(0, method.parents);
		} else if (method.method === 'fitnessProportionate') {
			var normalisedPopulation = [],
				minFitness = 0;
			for(var i = 0; i < population.length; i++) {
				if(population[i].fitness < minFitness) { minFitness = population[i].fitness; }
			}
			for(var i = 0; i < population.length; i++) {
				normalisedPopulation.push(population[i].fitness + Math.abs(minFitness));
			}
			var fitnessSum = 0,
				fshares = [];
			for(var i = 0; i < population.length; i++) {
				fitnessSum += normalisedPopulation[i];
			}
			for(var i = 0; i < population.length; i++) {
				fshares.push({index: i, fshare: normalisedPopulation[i] / fitnessSum});
			}
			while(parents.length < method.parents) {
				var normRandom = Math.random();
				var fshareK1Sum = 0,
					fshareKSum = 0,
					selectedIndex;
				for(var i = 0; i < fshares.length; i++) {
					fshareK1Sum += ((i === 0) ? 0 : fshares[i - 1].fshare);
					fshareKSum = fshareK1Sum + fshares[i].fshare;
					if((fshareK1Sum <= normRandom) && (fshareKSum >= normRandom)) {
						fshareIndex = 0;
						selectedIndex = fshares[i].index;
						break;
					}
				}
				parents.push(population[selectedIndex]);
				fshares.splice(selectedIndex, 1);
			}
		} else if(method.method === 'tournament') {
			while(parents.length < method.parents) {
				var tournament = [];
				for(var i = 0; i < method.tournamentSize; i++) {
					var randomNumber = Math.floor(Math.random() * (population.length));
					var selectedIndividual = population[randomNumber];
					selectedIndividual.index = randomNumber;
					tournament.push(selectedIndividual);
					population.splice(randomNumber, 1);
				}
				tournament = tournament.sort(fitnessOrder);
				population.splice(tournament[0].index, 1);
				delete tournament[0].index;
				parents.push(tournament[0]);
				tournament.splice(0, 1);
				population = population.concat(tournament);
			}
		} else if(method.method === 'localTournament' || method.method === 'spatialTournament') {

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
		population = population.sort(fitnessOrder);
		var popFitness = 0;
		for(var i = 0; i < population.length; i++) {
			popFitness += population[i].fitness;
		}
		options.midAlgorithmCall(population.sort(fitnessOrder));
		if(terminationCheck(population, options.maxGenerations, options.termination)) { break; }
		var parents = selectParents(population, options.selection);
		var parentFitness = 0;
		for(var i = 0; i < parents.length; i++) {
			parentFitness += parents[i].fitness;
		}
		population = createNewPopulation(parents, options.populationSize, options.mutationRate);
	}
	return population.sort(fitnessOrder)[0];
});

module.exports = genetic;
