angular.module('newsApp', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate'])

    .controller('NewsController', ['$scope', '$http',
        function ($scope, $http) {

            $scope.defaultUser = {
                username: '', hashed_password: '', email: '', favorites: []
            }

            $http({
                method: 'GET',
                url: '/user/profile'
            }).then(function (data, status, headers, config) {
                $scope.user = data.data;
                $scope.error = "";
            }, function (data, status, headers, config) {
                $scope.user = angular.copy($scope.defaultUser);
                console.log(data);
            });

            $scope.sources = [];
            $scope.topStories = [];

            $scope.sources = [
                { name: 'My Favorites', sourceName: 'my-favs', imgUrl: 'fav-sm.png', topStories: [], primary: '#e54e42', secondary: '#ffffff' },
                { name: 'BBC News', sourceName: 'bbc-news', imgUrl: 'bbc-sm.png', topStories: [], primary: '#9a0e15', secondary: '#ffffff' },
                { name: 'Business Insider', sourceName: 'business-insider', imgUrl: 'bi-sm.png', topStories: [], primary: '#20617b', secondary: '#ffffff' },
                { name: 'CNBC', sourceName: 'cnbc', imgUrl: 'cnbc-sm.png', topStories: [], primary: '#533e96', secondary: '#ffffff' },
                { name: 'CNN', sourceName: 'cnn', imgUrl: 'cnn-sm.png', topStories: [], primary: '#c91921', secondary: '#ffffff' },
                { name: 'ESPN', sourceName: 'espn', imgUrl: 'espn-sm.png', topStories: [], primary: '#c8232d', secondary: '#ffffff' },
                { name: 'Google News', sourceName: 'google-news', imgUrl: 'google-sm.png', topStories: [], primary: '#42af61', secondary: '#ffffff' },
                { name: 'Newsweek', sourceName: 'newsweek', imgUrl: 'nw-sm.png', topStories: [], primary: '#e82635', secondary: '#f2f2f2' },
                { name: 'Reddit', sourceName: 'reddit-r-all', imgUrl: 'red-sm.png', topStories: [], primary: '#cfe4f8', secondary: '#050607' },
                { name: 'The Huffington Post', sourceName: 'the-huffington-post', imgUrl: 'hp-sm.png', topStories: [], primary: '#347163', secondary: '#ffffff' },
                { name: 'The New York Times', sourceName: 'the-new-york-times', imgUrl: 'nyt-sm.png', topStories: [], primary: '#060708', secondary: '#ffffff' },
                { name: 'The Verge', sourceName: 'the-verge', imgUrl: 'tv-sm.png', topStories: [], primary: '#000000', secondary: '#eeeeee' },
                { name: 'The Wall Street Journal', sourceName: 'the-wall-street-journal', imgUrl: 'wsj-sm.png', topStories: [], primary: '#171717', secondary: '#ffffff' },
                { name: 'The Washington Post', sourceName: 'the-washington-post', imgUrl: 'wp-sm.png', topStories: [], primary: '#000000', secondary: '#ffffff' },
                { name: 'Time', sourceName: 'time', imgUrl: 'time-sm.png', topStories: [], primary: '#ef291a', secondary: '#fbfefe' },
                { name: 'USA Today', sourceName: 'usa-today', imgUrl: 'usat-sm.png', topStories: [], primary: '#1aa0d7', secondary: '#ffffff' },
                { name: 'Wired', sourceName: 'wired-de', imgUrl: 'w-sm.png', topStories: [], primary: '#000000', secondary: '#d9d9d9' }
            ]

            $scope.topStories = [];

            var key = '7250848b7b8c4776be033ea1bede9000';

            function getTopStories() {
                $scope.sources.forEach(function (element) {
                    if (element.sourceName != 'my-favs') {
                        var url = 'https://newsapi.org/v1/articles?source=' + element.sourceName + '&sortBy=top&apiKey=' + key;
                        $http.get(url)
                            .then(function (response) {
                                element.topStories = response.data.articles;
                            });
                    }
                });
            }

            getTopStories();

            $scope.activeSource = '';

            $scope.selectSource = function (source) {
                if ($scope.activeSource != source) {
                    if (source.sourceName != 'my-favs') {
                        $scope.topStories = source.topStories;
                    } else {
                        $scope.topStories = $scope.user.favorites;
                    }
                    $scope.activeSource = source;
                } else {
                    $scope.topStories = [];
                    $scope.activeSource = '';
                }
            }

            $scope.addToFavorites = function (index) {
                var article = $scope.topStories[index];
                $scope.user.favorites.push(article);

                $scope.updateUser();
            };

            function getFavoriteIdx(title) {
                for (var i = 0; i < $scope.user.favorites.length; i++) {
                    var a = $scope.user.favorites[i];
                    if (a.title == title) {
                        return i;
                    }
                }
                return null;
            }

            $scope.removeFromFavorites = function (title) {
                var idx = getFavoriteIdx(title);
                $scope.user.favorites.splice(idx, 1);

                $scope.updateUser();
            }

            $scope.updateUser = function () {
                $http({
                    url: '/user/update',
                    method: 'POST',
                    data: $scope.user
                }).then(function (data, status, headers, config) {
                    console.log($scope.user.favorites);
                }, function (data, status, headers, config) {
                    console.log("Update failed");
                    console.log(data);
                });
            }

            $scope.isFavorite = function (title) {
                for (var i = 0; i < $scope.user.favorites.length; i++) {
                    var a = $scope.user.favorites[i];
                    if (a.title == title) {
                        return true;
                    }
                }
                return false;
            }

            $scope.goTo = function (url) {
                var win = window.open(url, '_blank');
                win.focus();
            }

        }])

    .directive('backImg', function () {
        return function (scope, element, attrs) {
            var url = attrs.backImg;
            element.css({
                'background-image': 'url(' + url + ')',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center'
            });
        };
    })

    .directive('backColor', function () {
        return function (scope, element, attrs) {
            var colors = attrs.backColor.split(" ");
            element.css({
                'background-color': colors[0],
                'color': colors[1]
            })
        }
    })

    .config(function ($mdThemingProvider) {
        var customPrimary = {
            '50': '#99bef9',
            '100': '#81aff8',
            '200': '#699ff6',
            '300': '#5190f5',
            '400': '#3980f3',
            '500': '#2171f2',
            '600': '#0e63ec',
            '700': '#0c59d4',
            '800': '#0b4fbc',
            '900': '#0a44a3',
            'A100': '#b2cdfa',
            'A200': '#caddfc',
            'A400': '#e2ecfd',
            'A700': '#083a8b'
        };
        $mdThemingProvider
            .definePalette('customPrimary',
            customPrimary);

        var customAccent = {
            '50': '#9d9d9d',
            '100': '#909090',
            '200': '#838383',
            '300': '#767676',
            '400': '#6a6a6a',
            '500': '#5D5D5D',
            '600': '#505050',
            '700': '#434343',
            '800': '#373737',
            '900': '#2a2a2a',
            'A100': '#a9a9a9',
            'A200': '#b6b6b6',
            'A400': '#c3c3c3',
            'A700': '#1d1d1d'
        };
        $mdThemingProvider
            .definePalette('customAccent',
            customAccent);

        var customWarn = {
            '50': '#fbb4af',
            '100': '#f99d97',
            '200': '#f8877f',
            '300': '#f77066',
            '400': '#f55a4e',
            '500': '#F44336',
            '600': '#f32c1e',
            '700': '#ea1c0d',
            '800': '#d2190b',
            '900': '#ba160a',
            'A100': '#fccbc7',
            'A200': '#fde1df',
            'A400': '#fff8f7',
            'A700': '#a21309'
        };
        $mdThemingProvider
            .definePalette('customWarn',
            customWarn);

        $mdThemingProvider.theme('default')
            .primaryPalette('customPrimary')
            .accentPalette('customAccent')
            .warnPalette('customWarn')
    });