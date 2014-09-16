var nmpConfig = angular.module('nmpConfiguration', []);
nmpConfig.constant('HELPERS', [
  {
    'title': 'need money?',
    'class': 'm-add-money',
    'text': 'Get a loan to a friend: Receive € 200 but the inconvenience will cost you 250 points.',
    'happiness': -250,
    'money': 200,
    'conseguence': {
      'type': 'normal',
      'text': 'Testo help ricevuto'
    }
  },
  {
    'title': 'feel blue?',
    'class': 'm-add-points',
    'text': 'Give a gift to your parents: it costs 250 Euros, but seeing them happy will earn you 200 points.',
    'happiness': 200,
    'money': -250,
    'conseguence': {
      'type': 'normal',
      'text': 'Testo help2 ricevuto'
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
nmpConfig.constant('TIMERS', function () {
  var timers = {
      scene: {
        delay: 1500,
        duration: 400
      },
      choice: { duration: 300 },
      variation: {
        show: 400,
        lastDelay: 3750,
        lastDuration: 500,
        hide: 400
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
        duration: 500,
        wait: 3000
      }
    };
  timers.scene.total = timers.scene.delay + timers.scene.duration;
  timers.choice.total = timers.choice.duration;
  timers.variation.total = timers.variation.show + timers.variation.lastDelay + timers.variation.lastDuration;
  timers.conseguence.total = timers.conseguence.delay + timers.conseguence.duration;
  timers.report.total = timers.report.delay + timers.report.duration;
  timers.risk.show = timers.risk.delay + timers.risk.duration + timers.risk.wait;
  timers.risk.hide = timers.risk.delay + timers.risk.duration;
  return timers;
}());
var nmpApp = angular.module('nmpApp', ['nmpConfiguration']);

// different run for different screen size

if (window.matchMedia("(max-width: 640px)").matches) {
  nmpApp.run([
    '$location',
    '$rootScope',
    '$filter',
    'player',
    'scenes',
    'smallPreloadBackgrounds',
    function ($location, $rootScope, $filter, player, scenes, smallPreloadBackgrounds) {
      player.newPlayer($location.path().substring(1));
      $rootScope.playerName = $filter('capitalize')(player.getPlayer().name);
      scenes.loadScenes();
      smallPreloadBackgrounds();
    }
  ]);
} else {
  nmpApp.run([
    '$location',
    '$rootScope',
    '$filter',
    'player',
    'scenes',
    'preloadBackgrounds',
    function ($location, $rootScope, $filter, player, scenes, preloadBackgrounds) {
      player.newPlayer($location.path().substring(1));
      $rootScope.playerName = $filter('capitalize')(player.getPlayer().name);
      scenes.loadScenes();
      preloadBackgrounds();
    }
  ]);
}
