nmpApp.controller('sidebar', function ($scope, $rootScope, player, scenes, choiceFactory, HELPERS, $q) {
  $scope.player = player.getPlayer();
  $scope.scenes = scenes;
  $scope.helpers = HELPERS;
  $scope.choice = null;
  $scope.conseguence = null;
  $scope.openHelper = function ($index) {
    $scope.choice = choiceFactory.new(this.helper);
    function useHelp() {
      $scope.helpers[$index].disabled = true;
      $rootScope.$emit('helper:variation:open', $scope.choice.scelto());
    }
    $rootScope.$broadcast('helper:modal:open', $scope.choice, useHelp);
  };
});
nmpApp.controller('game', function ($scope, $rootScope, $timeout, TIMERS, scenes, transitionEndEvents, uiChoiceManager) {
  $scope.scene = scenes.getCurrentScene();
  $scope.choice = null;
  $scope.conseguence = null;
  var $backToSceneContainers = $('#conseguenza, #scelta'), $stats = $('#stats'), $variazione = $('#variazione');
  $scope.ui = {
    showChoice: function () {
      $scope.choice = this.choice;
      $scope.$broadcast('choice:open');
    },
    closeChoice: function () {
      $scope.$broadcast('choice:close');
      $timeout(function () {
        $scope.choice = null;
      }, TIMERS.choice.total);
    },
    closeReport: function () {
      $scope.$broadcast('report:close');
      $scope.$broadcast('scene:open');
    }
  };
  $scope.getConseguence = uiChoiceManager.getConseguence.bind(null, $scope);
  // $scope.backToScene = function () {
  // 	$scope.$broadcast('choice:close');
  // 	$scope.$broadcast('report:close');
  // 	$scope.$broadcast('scene:open');
  // 	$timeout(function () {
  // 		$scope.choice = null;
  // 		$scope.conseguence = null;
  // 	}, TIMERS.choice.total);
  // 	// if($scope.conseguence && $scope.conseguence.stop === false)
  // 	// 	$stats.on(transitionEndEvents, function (e) {
  // 	// 		$scope.$apply(function () {
  // 	// 			scenes.nextScene();
  // 	// 		});
  // 	// 		//avoid double fire
  // 	// 		$stats.off(transitionEndEvents);
  // 	// 	});
  // }
  // $scope.getConseguence = function () {
  // 	$scope.conseguence = $scope.choice.scelto();
  // 	$scope.$broadcast('choice:close');
  // 	$scope.$broadcast('scene:close');
  // 	if($scope.choice.conseguence.type === 'random') {
  // 		$scope.$broadcast('risk:open');
  // 		$timeout(function () {
  // 			$scope.$broadcast('risk:close');
  // 			$scope.$broadcast('conseguence:open');
  // 		}, 5*1000);
  // 		return;
  // 	} else {
  // 		$scope.$broadcast('variazione:open');
  // 		$variazione.find('#pt-after').one(transitionEndEvents, function (e) {
  // 			$timeout(function () {
  // 				$scope.$broadcast('variazione:close');
  // 				$scope.$broadcast('conseguence:open');
  // 			}, 2*1000); // 2 secondi dopo la fine delle transizioni
  // 			$(this).off(transitionEndEvents);
  // 		});
  // 	}
  // }
  // $scope.getReport = function () {
  // 	$scope.$broadcast('conseguence:close');
  // 	if($scope.conseguence.stop === true)
  // 		$scope.backToScene();
  // 	else
  // 		$scope.$broadcast('report:open');
  // }
  $rootScope.$on('sceneUpdated', function () {
    $scope.scene = scenes.getCurrentScene();
    $scope.$broadcast('scene:open');
  });
});