nmpApp.service('player', ['CHARACTERS', '$rootScope', '$location', function (CHARACTERS, $rootScope, $location) {
	// Player class
	function Player () {
		this.happiness = 0;
		this.money = 0;
	}

	Player.prototype.addHappiness = function (deltaHappiness) {
		this.happiness += deltaHappiness;
		$rootScope.$broadcast('playerUpdated');
	}

	Player.prototype.addMoney = function (deltaMoney) {
		this.money += deltaMoney;
		$rootScope.$broadcast('playerUpdated');
	}

	Player.prototype.setCharacter = function (name) {
		this.name = name.toLowerCase();

		if( !(this.name in CHARACTERS) ) {
			// Prendo il primo valore come default
			this.name = Object.keys(CHARACTERS)[0];
		}

		this.happiness = CHARACTERS[this.name].start.happiness;
		this.money = CHARACTERS[this.name].start.money;
	}

	Player.prototype.isLoser = function () {
		return this.money < 0 || this.happiness < 0;
	}

	var service = {};
	service.getPlayer = function () {
		return service._player;
	}
	service.newPlayer = function (character) {
		var pl = new Player();
			pl.setCharacter(character);
		return service._player = pl;
	}

	return service;
}])

nmpApp.service('scenes', ['$http', '$rootScope', 'player', 'sceneFactory', function ($http, $rootScope, player, sceneFactory) {
	var $body = angular.element(document.body);
	var service = {
		scenes: [],
		// indica se le scene sono state caricate
		scenesLoaded: false,
		currentIndex: -1,

		loadScenes: function () {
			var url = './scenes/' + player.getPlayer().name + '/all.json';

			function onSuccess(result) {
				result.forEach(function (scene) {
					service.scenes.push(
						sceneFactory.new(scene)
					);
				});
				service.scenesLoaded = true;
				service.changeScene(0);
			}

			function onError() {
				alert('There is a problem!');
			}

			$http({ method:"GET", url:url, cache:false })
				.success(onSuccess)
				.error(onError);
		},

		isLastScene: function () {
			return service.currentIndex === service.scenes.length -1;
		},

		isFirstScene: function () {
			return service.currentIndex === 0;
		},

		getCurrentScene: function () {
			return service.scenes[service.currentIndex];
		},

		changeScene: function (index) {
			if(index < 0)
				throw "Error";

			if(index === service.scenes.length) {
				window.location.href = 'win.html';
				return;
			}

			if(player.getPlayer().isLoser()) {
				window.location.href = 'lose.html';
				return;
			}

			service.currentIndex = index;
			$rootScope.$broadcast('sceneUpdated');
			$body.attr('data-theme', service.getCurrentScene().theme);
		},

		nextScene: function () {
			service.changeScene(service.currentIndex+1);
		},

		prevScene: function () {
			service.changeScene(service.currentIndex-1);
		}
	};

	return service;
}]);


nmpApp.service('sceneFactory', ['$rootScope', 'choiceFactory', function ($rootScope, choiceFactory) {
	function Scena (jO) {
		angular.extend(this, jO);
		this.choices = [];
		this.trapable = true;

		var _self = this;


		jO.choices.forEach(function (choice) {
			_self.choices.push(choiceFactory.new(choice, _self));
		});
	}

	Scena.prototype.fallInTrap = function () {
		this.trapable = false;
	}

	return {
		new: function (jsonObject) {
			return new Scena(jsonObject);
		}
	}
}]);

nmpApp.service('choiceFactory', ['$rootScope', 'player', function ($rootScope, player) {
	function Choice (jO, parentScene) {
		angular.extend(this, jO);

		// Inizializzo la scelta come valida
		this.enabled = true;

		this.parentScene = parentScene;
	}

	// Applica la prima variazione prima della roulette
	Choice.prototype.applyFirstRandom = function () {
		this.applyChoice({
			happiness: this.happiness,
			money: this.money
		});
	}

	Choice.prototype.scelto = function () {
		var typeFunction = 'buildConseguence'
						+ this.conseguence.type.charAt(0).toUpperCase()
						+ this.conseguence.type.slice(1);

		var eventData = this[typeFunction]();

		this.applyChoice(eventData);
		return eventData;
	}

	Choice.prototype.buildConseguenceNormal = function () {
		return {
			title: this.title,
			text: this.conseguence.text,
			happiness: this.happiness,
			money: this.money,
			stop: false,
			risk: false
		};
	}

	Choice.prototype.buildConseguenceTrap = function () {
		if(this.parentScene.trapable === false)
			return this.buildConseguenceNormal();

		this.enabled = false;
		this.parentScene.fallInTrap();

		//  se entro nella trappola, prendo i modificatori relativi
		return {
			title: this.title,
			text: this.conseguence.trapText,
			happiness: this.conseguence.trapHappiness,
			money: this.conseguence.trapMoney,
			stop: true,
			risk: false
		}
	}

	Choice.prototype.buildConseguenceRandom = function () {
		function getRandomConseguence (cases) {
			var r = Math.floor(Math.random()*100);
			for( i in cases ) {
				if(r <= cases[i].probability)
					return i;
				r -= cases[i].probability;
			}

			throw "ERROR: non sono riuscito a scegliere una conseguenza";
		}


		var index = getRandomConseguence(this.conseguence.cases);
		var cons = this.conseguence.cases[index];

		this.enabled = !cons.stop;

		// this.applyRandom = function () {
		// 	player.getPlayer().addHappiness(cons.happiness);
		// 	player.getPlayer().addMoney(cons.money);
			
		// 	return {
		// 		title: this.title,
		// 		text: cons.text,
		// 		stop: cons.stop
		// 	}
		// }

		return {
			title: this.title,
			waitingText: this.conseguence.waitingText,
			happiness: cons.happiness,
			money: cons.money,
			text: cons.text,
			"class": cons.class,
			stop: cons.stop
		}
	}

	Choice.prototype.applyChoice = function (eventData) {
		player.getPlayer().addHappiness(eventData.happiness);
		player.getPlayer().addMoney(eventData.money);
	}

	return {
		new: function (jsonObject, parent) {
			return new Choice(jsonObject, parent);
		}
	}
}]);


nmpApp.service('uiChoiceManager', function ($rootScope, $timeout, $q, TIMERS, scenes) {
	var $gameScope = null;
	var gameQueue = null;

	function getQueue() {
		var d = $q.defer();
		$timeout(d.resolve.bind(d), 50);
		return d.promise;
	}

	function backToScene() {
		$gameScope.$broadcast('scene:open');
		return $q.reject();
	}

	function showVariation(dH, dM) {
		$gameScope.$broadcast('choice:close');
		$gameScope.$broadcast('scene:close');
		
		if(dH == 0 && dM == 0 && $gameScope.conseguence.happiness == 0 && $gameScope.conseguence.money == 0)
			return false;

		var d = $q.defer();
	
		$gameScope.$broadcast('variazione:open', dH, dM);

		// At the end
		$timeout(d.resolve.bind(d), TIMERS.variation.total);
		
		return d.promise;
	}

	function hideVariation (wasOpened) {
		if(wasOpened === false)
			return;
		var d = $q.defer();
		
		$gameScope.$broadcast('variazione:close');
		$timeout(d.resolve.bind(d), TIMERS.variation.hide);

		return d.promise;
	}

	function showConseguence() {
		var d = $q.defer();

		$gameScope.$broadcast('choice:close');
		$gameScope.$broadcast('scene:close');

		$gameScope.$broadcast('conseguence:open');
		$gameScope.ui.showReport = d.resolve.bind(d);
		// $timeout(d.resolve.bind(d), TIMERS.conseguence.total);

		return d.promise;
	}

	function hideConseguence() {
		// var d = $q.defer();

		$gameScope.$broadcast('conseguence:close');

		// return d.promise;
	}

	function checkStop() {
		if($gameScope.conseguence.stop === true)
			return backToScene();
		else
			return true;
	}

	function showReport() {
		var d = $q.defer();

		$gameScope.$broadcast('report:open');
		$gameScope.ui.next = function () {
			$gameScope.$broadcast('report:close');
			$timeout(d.resolve.bind(d), TIMERS.report.total);
		};

		return d.promise;
	}

	function showRisk() {
		var d = $q.defer();

		$gameScope.$broadcast('choice:close');
		$gameScope.$broadcast('scene:close');
		$gameScope.$broadcast('risk:open');

		// At the end
		$timeout(d.resolve.bind(d), TIMERS.risk.show);
		
		return d.promise;
	}

	function hideRisk() {
		var d = $q.defer();

		$gameScope.$broadcast('risk:close');
		// At the end
		$timeout(d.resolve.bind(d), TIMERS.risk.hide);


		return d.promise;
	}

	function nextScene() {
		$gameScope.choice = null;
		$gameScope.conseguence = null;
		scenes.nextScene();
	}

	function normalChoice () {
		$gameScope.conseguence = $gameScope.choice.scelto();
		getQueue()
			.then(showConseguence)
			.then(hideConseguence)
			.then(showVariation)
			.then(hideVariation)
			.then(checkStop)
			// .then(null, backToScene) // failure catch
			.then(showReport)
			.then(nextScene)
	}

	function randomChoice () {
		// $gameScope.conseguence = $gameScope.choice.scelto();
		$gameScope.choice.applyFirstRandom();

		getQueue()
			.then(showVariation.bind(null, $gameScope.choice.happiness, $gameScope.choice.money))
			.then(hideVariation)
			.then(showRisk)
			.then(hideRisk)
			.then(function () {
				$gameScope.conseguence = $gameScope.choice.scelto();
			})
			.then(showConseguence)
			.then(hideConseguence)
			.then(showVariation)
			.then(hideVariation)
			.then(checkStop)
			// .then(null, backToScene) // failure catch
			.then(showReport)
			.then(nextScene)
	}

	this.getConseguence = function ($scope) {
		$gameScope = $scope;

		var type = $scope.choice.conseguence.type;
		console.log('Choice type: ' + type);
		if(type === 'normal')
			normalChoice();
		else if(type === 'trap')
			normalChoice();
		else if(type === 'random')
			randomChoice();
	}

});