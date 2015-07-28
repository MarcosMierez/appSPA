(function () {
    var app = angular.module('testeApp', ['ngRoute']);

    app.config(['$routeProvider',
           function ($routeProvider) {
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

    app.controller('detalheController', function ($scope, NoticiaService,$routeParams) {
        init();
        function init() {
            var promisseGet = NoticiaService.detalheNoticia($routeParams.Id);
            promisseGet.then(function (rs) {
                $scope.noticiaDetalhe = rs.data;
            });
        };
    });

    app.controller('cadastroController', function (NoticiaService,$scope) {
        init();

        function init() {
          
            $scope.postarnoticia = function (noticia) {
                NoticiaService.publicarNoticia(noticia);
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
            return $http.post('http://testeapi-2.apphb.com/Api/NoticiaApi', noticia);
        }
    });

}());