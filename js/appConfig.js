var nmpConfig = angular.module('nmpConfiguration', []);

nmpConfig.constant('HELPERS', [
	{
		"title": "bisogno di soldi?",
		"class": "m-add-money",
		"text": "Chiedi un prestito ad un amico: ricevi 200 euro ma il disagio ti costerà 250 punti.",
		"happiness": -250,
		"money": 200,
		"conseguence": {
			"type": "normal",
			"text": "Testo help ricevuto"
		}
	},
	{
		"title": "morale a terra?",
		"class": "m-add-points",
		"text": "Fai un regalo ai tuoi genitori: costa 250 euro, ma sentirli felici ti farà guadagnare 200 punti.",
		"happiness": 200,
		"money": -250,
		"conseguence": {
			"type": "normal",
			"text": "Testo help2 ricevuto"
		}
	}
]);

nmpConfig.constant('CHARACTERS', {
	'benjamin': {
		start: {
			happiness: 800,
			money: 100
		}
	},
	'fatima': {
		start: {
			happiness: 600,
			money: 700
		}
	},
	'irina': {
		start: {
			happiness: 650,
			money: 100
		}
	},
	'zhang': {
		start: {
			happiness: 100,
			money: 650
		}
	}
});

nmpConfig.constant('transitionEndEvents', 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');

nmpConfig.constant('TIMERS', (function () {
	var timers = {
		scene: {
			delay: 1500,
			duration: 400
		},
		choice: {
			duration: 300
		},
		variation: {
			show: 400, // durata effetto di entrata
			lastDelay: 3750, // delay dell'ultima variazione grafica
			lastDuration: 500, // durata dell'ultima variazione grafica
			hide: 400 // durata effetto di uscita
		},
		conseguence: {
			delay: 500,
			duration: 800
		},
		report: {
			delay: 500,
			duration: 500
		},
		risk: {
			delay: 500,
			duration: 500, // durata transizione
			wait: 3000 // attesa guardando la "roulette"
		}
	}

	timers.scene.total = timers.scene.delay + timers.scene.duration;
	timers.choice.total = timers.choice.duration;
	timers.variation.total = timers.variation.show + timers.variation.lastDelay + timers.variation.lastDuration;
	timers.conseguence.total = timers.conseguence.delay + timers.conseguence.duration;
	timers.report.total = timers.report.delay + timers.report.duration;
	
	timers.risk.show = timers.risk.delay + timers.risk.duration + timers.risk.wait;
	timers.risk.hide = timers.risk.delay + timers.risk.duration;


	return timers;
})())


var nmpApp = angular.module('nmpApp', ['nmpConfiguration']);

nmpApp.run(function ($location, $rootScope, $filter, player, scenes, preloadBackgrounds) {
	player.newPlayer($location.path().substring(1));
	$rootScope.playerName = $filter('capitalize')(player.getPlayer().name);
	scenes.loadScenes();

	preloadBackgrounds();
});