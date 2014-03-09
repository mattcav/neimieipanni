nmpApp.directive('scene', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        function open() {
          element.addClass('show').removeClass('leave');
        }
        function close() {
          element.addClass('leave').removeClass('show');
        }
        scope.$on('scene:open', open);
        scope.$on('scene:close', close);
      }
    };
  }]);
nmpApp.directive('choice', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        function open() {
          element.addClass('md-show');
          $('.md-overlay').addClass('show');
        }
        function close() {
          element.removeClass('md-show');
          $('.md-overlay').removeClass('show');
        }
        scope.$on('choice:open', open);
        scope.$on('choice:close', close);
      }
    };
  }]);
nmpApp.directive('conseguence', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        function open() {
          element.addClass('show');
        }
        function close() {
          element.removeClass('show');
        }
        scope.$on('conseguence:open', open);
        scope.$on('conseguence:close', close);
      }
    };
  }]);
nmpApp.directive('report', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        function open() {
          element.addClass('show').removeClass('leave');
        }
        function close() {
          element.removeClass('show').addClass('leave');
        }
        scope.$on('report:open', open);
        scope.$on('report:close', close);
      }
    };
  }]);
nmpApp.directive('risk', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        function open() {
          element.addClass('show').removeClass('leave');
        }
        function close() {
          element.removeClass('show').addClass('leave');
        }
        scope.$on('risk:open', open);
        scope.$on('risk:close', close);
      }
    };
  }]);
nmpApp.directive('variazione', function ($timeout, TIMERS, player) {
  var eVar = $('#e-variazione');
  var hVar = $('#pt-variazione');
  return {
    restrict: 'A',
    link: function (scope, element, attrs, controller) {
      function open(event, dH, dM) {
        if (dH === undefined && dM === undefined) {
          dH = scope.conseguence.happiness;
          dM = scope.conseguence.money;
        }
        console.log('Delta: ', dH, dM);
        scope.variazione = {
          happiness: {
            attuale: player.getPlayer().happiness,
            delta: dH > 0 ? '+' + dH : dH,
            prima: player.getPlayer().happiness - dH
          },
          money: {
            attuale: player.getPlayer().money,
            delta: dM > 0 ? '+' + dM : dM,
            prima: player.getPlayer().money - dM
          }
        };
        if (scope.variazione.money.delta != 0)
          eVar.addClass('go-variazione');
        if (scope.variazione.happiness.delta != 0)
          hVar.addClass('go-variazione');
        // console.log(scope.variazione);
        element.addClass('show').removeClass('leave');
      }
      function close() {
        element.removeClass('show').addClass('leave');
        $timeout(function () {
          eVar.removeClass('go-variazione');
          hVar.removeClass('go-variazione');
        }, TIMERS.variation.hide);
      }
      scope.$on('variazione:open', open);
      scope.$on('variazione:close', close);
    }
  };
});
nmpApp.directive('helper', function ($rootScope, $timeout, TIMERS, player) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, controller) {
      var $modal = angular.element(element.children()[0]), $variation = angular.element(element.children()[1]);
      function openModal(event, data, useHelp, closeHelp) {
        scope.help = data;
        scope.useHelp = function () {
          (useHelp || angular.noop)();
          $rootScope.$emit('helper:modal:close', false);
        };
        scope.closeHelp = function () {
          (closeHelp || angular.noop)();
          $rootScope.$emit('helper:modal:close', true);
        };
        $modal.addClass('md-show');
        $('.md-overlay').addClass('show');
      }
      function closeModal(event, closeOverlay) {
        $modal.removeClass('md-show');
        if (closeOverlay === true)
          $('.md-overlay').removeClass('show');
      }
      // function openConseguence(event, cons) {
      // 	scope.conseguence = cons;
      // 	scope.closeCons = $rootScope.$emit.bind($rootScope, 'helper:variation:open');
      // 	$('.md-overlay').addClass('show');
      // }
      function openVariation(event, cons) {
        scope.conseguence = cons;
        var dH = scope.conseguence.happiness, dM = scope.conseguence.money;
        scope.conseguence.applicaVariazione();
        scope.variazione = {
          happiness: {
            attuale: player.getPlayer().happiness,
            delta: dH > 0 ? '+' + dH : dH,
            prima: player.getPlayer().happiness - dH
          },
          money: {
            attuale: player.getPlayer().money,
            delta: dM > 0 ? '+' + dM : dM,
            prima: player.getPlayer().money - dM
          }
        };
        if (scope.variazione.money.delta != 0)
          $('#h-e-variazione').addClass('go-variazione');
        if (scope.variazione.happiness.delta != 0)
          $('#h-pt-variazione').addClass('go-variazione');
        $variation.addClass('show').removeClass('leave');
        $timeout(function () {
          $rootScope.$broadcast('helper:variation:close');
        }, TIMERS.variation.total);
      }
      function closeVariation() {
        $variation.addClass('leave').removeClass('show');
        $('#h-e-variazione, #h-pt-variazione').removeClass('go-variazione');
        $('.md-overlay').removeClass('show');
      }
      $rootScope.$on('helper:modal:open', openModal);
      $rootScope.$on('helper:modal:close', closeModal);
      $rootScope.$on('helper:variation:open', openVariation);
      $rootScope.$on('helper:variation:close', closeVariation);
    }
  };
});