angular
    .module('teamform')
    .controller('SkillsMatchCtrl', ['$scope', '$firebaseArray', 'Events', 'Teams', 'Auth', '$stateParams', '$state', 'Tags', '$filter', SkillsMatchCtrl]);

function SkillsMatchCtrl($scope, $firebaseArray, Events, Teams, Auth, $stateParams, $state, Tags, $filter) {

    var uid = Auth.$getAuth().uid;

    // var ref = $firebaseArray(Tags.uref);

    $scope.uSearch = [];
    $scope.eSearch = [];
    $scope.tSearch = [];

    $scope.uResult = [];
    $scope.eResult = [];
    $scope.tResult = [];

    $scope.uTags = $firebaseArray(Tags.uref);
    $scope.eTags = $firebaseArray(Tags.eref);
    $scope.tTags = $firebaseArray(Tags.tref);

    $scope.SearchUser = function() {
        if ($scope.uSearch !== []) {
            $scope.uResult = [];
            $scope.uTags.$loaded().then(function(users) {
                angular.forEach(users, function(user) {
                    if (user.tags !== null) {
                        var uId = user.$id;

                        var sCount = Object.keys($scope.uSearch).length;
                        var uCount = Object.keys(user.tags).length;
                        if (sCount <= uCount) {
                            var found = 0;

                            $scope.uSearch.some(function(sTag) {
                                user.tags.some(function(uTag) {
                                    if ($filter('lowercase')(sTag.text) === $filter('lowercase')(uTag.text))
                                        found++;
                                });
                            });

                            if (found) {
                                firebase.database().ref('users').child(uId).once("value").then(function(data) {
                                    if (data.val() !== null) {
                                        var Match = {
                                            email: data.val().email,
                                            name: data.val().name,
                                            tags: user.tags
                                        };
                                        $scope.uResult.push(Match);
                                    }
                                    $scope.$apply();
                                });
                            }
                        }
                    }
                });
            });
        }
    };

    $scope.SearchEvent = function() {
        if ($scope.eSearch !== []) {
            $scope.eResult = [];
            $scope.eTags.$loaded().then(function(eData) {
                angular.forEach(eData, function(event) {
                    if (event.tags !== null) {
                        var eId = event.$id;

                        var sCount = Object.keys($scope.eSearch).length;
                        var eCount = Object.keys(event.tags).length;
                        if (sCount <= eCount) {
                            var found = 0;

                            $scope.eSearch.some(function(sTag) {
                                event.tags.some(function(eTag) {
                                    if ($filter('lowercase')(sTag.text) === $filter('lowercase')(eTag.text))
                                        found++;
                                });
                            });

                            if (found !== 0) {
                                Events.childRef(eId).once("value").then(function(data) {
                                    if (data.val() !== null) {
                                        var Match = {
                                            title: data.val().title,
                                            organizer: data.val().organizer,
                                            deadline: data.val().deadline
                                        };
                                        $scope.eResult.push(Match);
                                    }
                                    $scope.$apply();
                                });
                            }
                        }
                    }
                });
            });
        }
    };

    // $scope.SearchTeam = function() {
    //     if ($scope.tSearch !== []) {
    //         $scope.tResult = [];
    //         $scope.tTags.$loaded().then(function(tData) {
    //             angular.forEach(tData, function(team) {
    //               if()
    //             });
    //         });
    //     }
    // }
}
