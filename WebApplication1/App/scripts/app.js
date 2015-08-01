(function () {
    var app = angular.module('testeApp', ['ngRoute']);

    app.config(['$routeProvider', '$locationProvider',
           function ($routeProvider, $locationProvider) {
             
              $routeProvider.
                 when('/noticias', {
               templateUrl: 'partials/lista.html',
               controller: 'testeController'
                 }).when('/noticias/:Id', {
                     templateUrl: 'partials/detalhe.html',
                     controller: 'detalheController'
                 })
                  .when('/cadastro', {
                      templateUrl: 'partials/cadastro.html',
                      controller: 'cadastroController'
                  }).when('/editar/:Id', {
                      templateUrl: 'partials/editar.html',
                      controller: 'editarController'
                  }).when('/excluir/:Id', {
                      templateUrl: 'partials/excluir.html',
                      controller: 'excluirController'
                  }).
                 otherwise({
                     redirectTo: '/noticias'
                 });
           }]);

    app.controller('testeController', function ($scope, NoticiaService) {
        init();
        function init() {
           
            var promisseGet = NoticiaService.listarNoticias();
            promisseGet.then(function (rs) {
                $scope.allNotices = rs.data;
            });
        };
    });

    app.controller('detalheController', function ($scope, NoticiaService,$routeParams,$route) {
        init();
        function init() {
            var promisseGet = NoticiaService.detalheNoticia($routeParams.Id);
            promisseGet.then(function (rs) {
                $scope.noticia = rs.data;
            });
            $scope.updateNoticia = function (noticia) {
                NoticiaService.update(noticia);
                $route.reload();
                $location.path('/noticias');
            }
        };
    });

    app.controller('cadastroController', function (NoticiaService, $scope, $location,$route) {
        init();

        function init() {
            $scope.postarnoticia = function (noticia) {
                NoticiaService.publicarNoticia(noticia);
                $location.path('/noticias');
            };
        };
    });
    app.controller('editarController', function(NoticiaService,$location,$routeParams,$scope,$route) {
        init();

        function init() {
            var detalhe = NoticiaService.detalheNoticia($routeParams.Id);
            detalhe.then(function (rs) {
                $scope.noticia = rs.data;
            });
            $scope.updateNoticia = function (noticia) {
                NoticiaService.updateNt(noticia, $routeParams.Id);
                $route.reload();
                $location.path('/noticias');
            }
        }
    });
    app.controller('excluirController', function(NoticiaService,$routeParams,$scope,$route,$location) {
        init();

        function init() {
            var promisseGet = NoticiaService.detalheNoticia($routeParams.Id);
            promisseGet.then(function (rs) {
                $scope.noticia = rs.data;
            });
            $scope.removerNoticia = function(noticiaId) {
                NoticiaService.deleteNotica(noticiaId);
                $route.reload();
                $location.path('/noticias');
            }
        };
    });





    app.service('NoticiaService', function ($http) {

        this.listarNoticias = function() {
            return $http.get('http://testeapi-2.apphb.com/Api/NoticiaApi');
        };
        this.detalheNoticia = function (noticiaId) {
            return $http.get('http://testeapi-2.apphb.com/api/detalhe/' + noticiaId);
        }
        this.publicarNoticia = function (noticia) {

            $http.post('http://testeapi-2.apphb.com/Api/NoticiaApi', noticia);
        }
        this.updateNt = function (noticia,id) {

            $http.put('http://testeapi-2.apphb.com/Api/NoticiaApi/', noticia);
        }
        this.deleteNotica = function(id) {
           return  $http.delete('http://testeapi-2.apphb.com/api/delete/' + id);
        }
    });

}());