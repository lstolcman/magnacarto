angular.module('magna-app')

.controller('EditLayerCtrl', ['$scope', 'EditLayerFormStatusService', '$modal', '$modalInstance', 'layer',
  function($scope, EditLayerFormStatusService, $modal, $modalInstance, layer) {
    $scope.layer = angular.copy(layer);

    $scope.datasourceTemplates = {
      'gdal': 'src/layer/gdal-datasource-template.html',
      'sqlite': 'src/layer/sqlite-datasource-template.html',
      'postgis': 'src/layer/postgis-datasource-template.html',
      'shape': 'src/layer/shape-datasource-template.html'
    };

    $scope.hideGeneral = EditLayerFormStatusService.hideGeneral();
    $scope.hideExtentSRS = EditLayerFormStatusService.hideExtentSRS();
    $scope.hideDatasource = EditLayerFormStatusService.hideDatasource();

    $scope.$watch('hideGeneral', function(hideGeneral) {
      EditLayerFormStatusService.hideGeneral(hideGeneral);
    });

    $scope.$watch('hideExtentSRS', function(hideExtentSRS) {
      EditLayerFormStatusService.hideExtentSRS(hideExtentSRS);
    });

    $scope.$watch('hideDatasource', function(hideDatasource) {
      EditLayerFormStatusService.hideDatasource(hideDatasource);
    });

    var cleanupDatasource = function(datasource) {
      switch(datasource.type) {
        case 'postgis':
          return {
            'type': datasource.type,
            'host': datasource.host,
            'port': datasource.port,
            'dbname': datasource.dbname,
            'user': datasource.user,
            'password': datasource.password,
            'extent': datasource.extent,
            'extent_cache': datasource.extent_cache,
            'geometry_field': datasource.geometry_field,
            'key_field': datasource.key_field,
            'srid': datasource.srid,
            'table': datasource.table
          };
        case 'sqlite':
          return {
            'type': datasource.type,
            'file': datasource.file,
            'attachdb' : datasource.attachdb,
            'extent': datasource.extent,
            'geometry_field': datasource.geometry_field,
            'key_field': datasource.key_field,
            'srid': datasource.srid,
            'table': datasource.table
          };
        case 'shape':
          return  {
            'type': datasource.type,
            'file': datasource.file
          };
        case 'gdal':
          return {
            'type': datasource.type,
            'file': datasource.file,
            'band': datasource.band
          };
        default:
          return datasource;
      }

    };

    $scope.ok = function () {
      if ($scope.layerForm.$invalid) {
        return false;
      }
      $scope.layer.Datasource = cleanupDatasource($scope.layer.Datasource);
      $modalInstance.close($scope.layer);
    };

    $scope.openRemoveModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'src/layer/remove-layer-template.html',
        controller: 'RemoveLayerCtrl',
        backdrop: 'static',
        resolve: {
          layer: function () {
            return layer;
          }
        }
      });

      modalInstance.result.then(function () {
        $modalInstance.close('remove');
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);