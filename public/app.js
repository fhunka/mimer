import React from 'react';
import uiRoutes from 'ui/routes';
import { uiModules } from 'ui/modules';
import chrome from 'ui/chrome';
import { render, unmountComponentAtNode } from 'react-dom';

import 'ui/autoload/styles';
import './less/main.less';
import { Main } from './components/main';
import { QueryList, QueryPage } from './components/queries';
//import { QueryPage } from './components/queries';

import template from './components/index.html';
import issues_index_template from './components/issues/index.html';
import schedules_index_template from './components/schedules/index.html';
import queries_index_template from './components/queries/index.html';
import queries_show_template from './components/queries/query.html';

import usecases_index_template from './components/usecases/index.html';
import usecasess_show_template from './components/usecases/usecase.html';

const app = uiModules.get("apps/jagTestarEttPlugin");

app.config($locationProvider => {
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false,
  });
});
app.config(stateManagementConfigProvider =>
  stateManagementConfigProvider.disable()
);

uiRoutes.enable();
uiRoutes.when('/', {
	template: template,
	controller: 'Cluster',
	resolve: {},
	reloadOnSearch: false
})
.when('/schedules', {
        template: schedules_index_template,
        controller: 'Schedules',
        resolve: {},
        reloadOnSearch: false
})
.when('/usecases', {
        template: usecases_index_template,
        controller: 'Usecases',
        resolve: {},
        reloadOnSearch: false
})
.when('/queries', {
        template: queries_index_template,
        controller: 'Queries',
        resolve: {},
        reloadOnSearch: false
})
.when('/queries/new', {
        template: queries_show_template,
        controller: 'Query',
        resolve: {},
        reloadOnSearch: false
})
.when('/query/:name', {
        template: queries_show_template,
        controller: 'Query',
        resolve: {},
        reloadOnSearch: false
})
.when('/issues', {
	template: issues_index_template,
	controller: 'Issues',
	resolve: {},
	reloadOnSearch: false
});

// Generate request for banner
app.controller('Cluster', function ($scope, $route, $http, $routeParams) {

	console.log($routeParams);
	//console.log($element);
	//const domNode = "";
	//render(<Issue />, document.getElementById('app2app'));
        render(<Main title="oaoa jag_testar_ett_plugin" httpClient={$http} params={$routeParams} />, document.getElementById('app2app'));
	//$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
		// $scope is local to controller, use global if sharing between controllers
	//	 $scope.result = response.data.resp;
	//});	
});

app.controller('Issues', function ($scope, $route, $http, $routeParams) {

        console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Issue />, document.getElementById('app2app'));
        render(<Main title="Issues" httpClient={$http} params={$routeParams} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});

app.controller('Schedules', function ($scope, $route, $http, $routeParams) {

        console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Issue />, document.getElementById('app2app'));
        render(<Main title="Schedules" httpClient={$http} params={$routeParams} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});

app.controller('Queries', function ($scope, $route, $http, $routeParams) {

        //console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Query />, document.getElementById('app2app'));
        render(<QueryList title="Queries" httpClient={$http} params={$routeParams} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});

app.controller('Query', function ($scope, $route, $http, $routeParams, $window) {

        //console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Query />, document.getElementById('app2app'));
        render(<QueryPage title="Create Query" httpClient={$http} params={$routeParams} windows={$window} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});

app.controller('Usecases', function ($scope, $route, $http, $routeParams) {

        //console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Query />, document.getElementById('app2app'));
        render(<QueryList title="Usecases" httpClient={$http} params={$routeParams} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});

app.controller('Usecase', function ($scope, $route, $http, $routeParams, $window) {

        //console.log($routeParams);
        //console.log($element);
        //const domNode = "";
        //render(<Query />, document.getElementById('app2app'));
        render(<QueryPage title="Create Usecase" httpClient={$http} params={$routeParams} windows={$window} />, document.getElementById('app2app'));
        //$http.get(chrome.addBasePath('/api/mimer/cluster_stats')).then((response) => {
                // $scope is local to controller, use global if sharing between controllers
        //       $scope.result = response.data.resp;
        //});   
});
//function RootController($scope, $element, $http, $routeParams ) {
//  const domNode = $element[0];
//console.log($element);
//console.log($httpParams);
  // render react to DOM
//  render(<Main title="oaoa jag_testar_ett_plugin" httpClient={$http} />, domNode);

  // unmount react on controller destroy
//  $scope.$on('$destroy', () => {
//    unmountComponentAtNode(domNode);
//  });
//}

//chrome.setRootController("jagTestarEttPlugin", RootController);
