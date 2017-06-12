// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('timbreo', ['ionic', 'ngCordova'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('timbreo', {
                        url: '/timbreo',
                        templateUrl: 'templates/timbreo.html'
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html'
                    });
            $urlRouterProvider.otherwise('/login');
        })

        .factory('PouchDB', function () {
            return PouchDB;
        })

        .controller('LoginController', function ($rootScope, $scope, $state) {
            $scope.colores = ['Naranja', 'Azul', 'Rosa'];
            $scope.comunas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            $rootScope.user = {'email': 'federicobouzas@gmail.com', 'comuna': '5', 'color': 'Naranja', 'mapa': 22};
            $scope.login = function () {
                $state.go("timbreo");
            };
        })

        .controller('TimbreoController', function ($rootScope, $scope, PouchDB, $ionicPopup, $timeout, $state) {
            var dbLocal = new PouchDB('timbreo');
            PouchDB.replicate(dbLocal, 'http://eideoos.com:5984/timbreo', {live: true, retry: true});
            $scope.preguntas = {
                1: {
                    texto: '¿Cómo evaluas hasta el momento la gestión del Presidente Mauricio Macri?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                },
                2: {
                    texto: '¿Cómo evaluas hasta el momento la gestión de HRL como Jefe de Gobierno de la Ciudad?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                }
            };
            $scope.areas = ['Ingraestructura y Obra Pública', 'Relaciones Exteriores', 'Educación', 'Economía', 'Salud', 'Desarrollo Social'];
            var resetForm = function () {
                $scope.formulario = {user: $rootScope.user, position: {}, respuestas: {}};
            };
            $scope.seleccionar = function (numero, valor) {
                $scope.formulario.respuestas[numero] = valor;
            };
            $scope.seleccionarMultiple = function (numero, seccion, valor) {
                $scope.formulario.respuestas[numero] = $scope.formulario.respuestas[numero] || {};
                $scope.formulario.respuestas[numero][seccion] = valor;
            };
            $scope.exit = function() {
                $rootScope.user = {};
                $state.go("login");
            };
            $scope.guardar = function () {
                var formulario = $scope.formulario;
                navigator.geolocation.getCurrentPosition(function (position) {
                    formulario.position.latitude = position.coords.latitude;
                    formulario.position.longitude = position.coords.longitude;
                    formulario.time = new Date().getTime();
                    dbLocal.post(formulario);
                }, function (error) {
                    console.log('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                });
                var alertPopup = $ionicPopup.alert({
                    title: 'Formulario guardado!',
                    template: '<ion-icon name="star"></ion-icon>',
                    buttons: []
                });
                $timeout(function () {
                    alertPopup.close();
                }, 3000);
                resetForm();
            };
            resetForm();
        });
