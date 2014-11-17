"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var ratesUrl = 'https://api.parse.com/1/classes/rates';

angular.module('rateApp', ['ui.bootstrap'])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'p96CdSaywCBIU4fRYBDifyk9oLn6UpYFFSYqP2T2';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'K5GfF6QOd93AiHYgFSxwk1YhHGBO3fWQjHMglDul';
	})
	.controller('rateController', function($scope, $http) {

		$scope.refreshRate = function() {
			$scope.loading = true;
			$http.get(ratesUrl + '?order=score')
				.success(function(data) {
					$scope.rates = data.results;
				})
				.error(function(err) {
					$scope.errorMessage = err;
				})
				.finally(function() {
					$scope.loading = false;
				});
		};

		$scope.refreshRate();
		$scope.newRate = {score: 0};

		$scope.addRate = function() {
			$scope.inserting = true;
			$http.post(ratesUrl, $scope.newRate)
				.success(function(responseData) {
                    $scope.newRate.objectId = responseData.objectId;
					$scope.rates.push($scope.newRate);
					$scope.newRate = {score: 0};
				})
                .error(function(err) {
                    $scope.errorMessage = err;

                })
                .finally(function() {
                    $scope.inserting = false;
                });
         };

		$scope.deleteRate = function(rate) {
			$scope.inserting = true;
			$http.delete(ratesUrl + '/' + rate.objectId, rate)
				.success(function() {
					$scope.refreshRate();
				})
				.error(function(err) {
					$scope.errorMessage = err;
				})
				.finally(function() {
					$scope.inserting = false;
				});
		};

		$scope.incrementRate = function(rate, amount) {
			if (rate.score >= 0) {
				$scope.updating = true;
				$http.put(ratesUrl + '/' + rate.objectId, {
					score: {
						__op: 'Increment',
						amount: amount
					}
				})
					.success(function (responseData) {
						console.log(responseData);
						rate.score = responseData.score;
					})
					.error(function (responseData) {
						console.log(responseData);
					})
					.finally(function () {
						$scope.updating = false;
					});
			}
		}; //incrementVotes

		$scope.updateRate = function(rate) {
			$http.put(ratesUrl + '/' + rate.objectId, rate)
				.success(function() {

				})
				.error(function(err) {
					$scope.errorMessage = err;
				});
		};
	});