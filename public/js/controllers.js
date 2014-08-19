'use strict';

mixtape93.controller('authController',
  ['$scope', '$http', '$location', '$timeout',
  function ($scope, $http, $location, $timeout)
{
  SC.initialize({
    client_id: '0482da9ad987e87ba383f481c357f403',
    redirect_uri: 'http://mixtape93.herokuapp.com/api/oauth'
  });
  $scope.authenticateToSoundcloud = function authenticateToSoundcloud () {
    SC.connect(function () {
      $timeout(function () {
        $scope.currentPath = $location.path('/stream');
      }, 0);
    });
  };
}]);

mixtape93.controller('streamController',
  ['$scope', '$http', '$sce', '$q',
  function ($scope, $http, $sce, $q)
{
  // Initialize variables.
  var stream = $scope.stream = [];
  SC.get('/me/activities/all', function (activities) {
    // console.log(JSON.stringify(activities,null,2));
    $scope.stream = stream.concat.apply(stream, activities.collection);
    $scope.getEmbed();
  });

  $scope.getEmbed = function getEmbed () {
    var promises = $scope.stream.map(function (item) {
      return SC.oEmbed(item.origin.uri, { auto_play: false }, function (oEmbed) {
        // console.log(JSON.stringify(oEmbed, null, 2));
        this.origin.oEmbed = oEmbed;
        this.origin.oEmbed.html = $sce.trustAsHtml(oEmbed.html);
      }.bind(item));
    });
    // return $q.all(promises);
    console.log(promises);
    // $q.all(promises).then(function () {
    //   $scope.$apply();
    //   console.log('is it working');
    // });
  };

  //   var requests = [];

  //   for (var i = 0; i < $scope.stream.length; i++) {
  //     var deferred = $q.defer();
  //     requests.push(deferred);

  //     var uri = $scope.stream[i].origin.uri;
  //     SC.oEmbed(uri, { auto_play: false }, function(oEmbed) {
  //       console.log(JSON.stringify(oEmbed, null, 2));
  //       this.origin.oEmbed = oEmbed;
  //       this.origin.oEmbed.html = $sce.trustAsHtml(oEmbed.html);
  //       // $scope.$apply();
  //     }.bind($scope.stream[i]), deferred.resolve, deferred.reject);
  //   }

  //   $q.all(requests).then(function () {
  //     $scope.$apply();
  //   });
  // };
}]);