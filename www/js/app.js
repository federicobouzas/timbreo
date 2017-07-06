// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('timbreo', ['ionic', 'ngCordova'])

        .run(function ($ionicPlatform, $rootScope) {
            $rootScope.remoteURL = 'https://couchdb.timbrea.me/timbreo-caba';
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

        .controller('LoginController', function ($ionicPopup, $rootScope, $scope, $state, PouchDB) {
            var dbLocal = new PouchDB('timbreo-caba');
            dbLocal.destroy();
            $scope.colores1 = ['Azul', 'Verde', 'Rosa'];
            $scope.colores2 = ['Naranja', 'Amarillo'];
            $scope.colores = $scope.colores1.concat($scope.colores2);
            $scope.comunas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            //$rootScope.user = {'identificacion': 'federicobouzas@gmail.com', 'comuna': '5', 'color': 'Naranja', 'mapa': 22};
            $rootScope.user = {};
            $scope.login = function () {
                var errores = [];
                if (!$rootScope.user.identificacion || $rootScope.user.identificacion == "") {
                    errores.push("- Identificación requerida.");
                }
                if (!$rootScope.user.comuna || $rootScope.user.comuna == "") {
                    errores.push("- Comuna requerida");
                }
                if (!$rootScope.user.color || $rootScope.user.color == "") {
                    errores.push("- Color de Zona requerido.");
                }
                if (!$rootScope.user.mapa || $rootScope.user.mapa == "") {
                    errores.push("- Número de Zona requerido.");
                } else if (isNaN($rootScope.user.mapa) || $rootScope.user.mapa < 1) {
                    errores.push("- Número de Zona incorrecto.");
                }
                if (errores.length) {
                    $ionicPopup.alert({
                        title: '¡Error de Ingreso!',
                        template: '<ul><li>' + errores.join('</li><li>') + '</li></ul>',
                        buttons: [{text: '<b>OK</b>', type: 'button-balanced'}]
                    });
                    return;
                }
                $state.go("timbreo");
            };
            $scope.seleccionar = function (attribute, valor) {
                $scope.user[attribute] = valor;
            };
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("ok GEO");
            }, function (error) {
                console.log('code: ' + error.code + '\nmessage: ' + error.message + '\n');
            });
        })

        .controller('TimbreoController', function ($ionicScrollDelegate, $rootScope, $scope, PouchDB, $ionicPopup, $timeout, $state) {
            var dbLocal = new PouchDB('timbreo-caba');
            PouchDB.replicate(dbLocal, $rootScope.remoteURL, {live: true, retry: true});
            $scope.preguntas = {
                1: {
                    tipo: 'simple.estado',
                    texto: '¿Cómo evaluás hasta el momento la gestión del Presidente Mauricio Macri?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                },
                2: {
                    tipo: 'simple.estado',
                    texto: '¿Cómo evaluás hasta el momento la gestión de HRL como Jefe de Gobierno de la Ciudad?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                }
            };
            $scope.preguntas2 = {
                6: {
                    tipo: 'simple.estado',
                    texto: '¿Qué imagen tenés de Mauricio Macri?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                },
                7: {
                    tipo: 'simple.estado',
                    texto: '¿Qué imagen tenés de Horacio Rodriguez Larreta?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                },
                8: {
                    tipo: 'simple.estado',
                    texto: '¿Qué imagen tenés de Elisa Lilita Carrió?',
                    opciones: {"MB": "Muy Buena", "B": "Buena", "R": "Regular", "M": "Mala", "MM": "Muy Mala"}
                },
                9: {
                    tipo: 'simple.estado',
                    texto: '¿Qué imagen tenés de Martín Lousteau?',
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
            $scope.exit = function () {
                $rootScope.user = {};
                $state.go("login");
            };
            $scope.guardar = function () {
                var formulario = $scope.formulario;
                formulario.time = new Date().getTime();
                console.log("start GEO");
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log("ok GEO");
                    formulario.position.latitude = position.coords.latitude;
                    formulario.position.longitude = position.coords.longitude;
                    dbLocal.post(formulario);
                }, function (error) {
                    console.log('code: ' + error.code + '\nmessage: ' + error.message + '\n');
                    dbLocal.post(formulario);
                });
                var alertPopup = $ionicPopup.alert({
                    title: '¡Formulario guardado!',
                    template: '<div class="thumbs-up"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></div>',
                    buttons: []
                });
                $ionicScrollDelegate.scrollTop();
                $timeout(function () {
                    alertPopup.close();
                }, 3000);
                resetForm();
            };
            resetForm();
        });
