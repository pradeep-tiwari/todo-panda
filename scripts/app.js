// RequireJS Configuration: http://requirejs.org/docs/api.html#config
requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        doT: 'doT.min',
        modules: '../modules',
        services: '../services',
        behaviors: '../behaviors',
        templates: '../templates'
    }
});



// Load and instantiate app
var app = Box.Application;

require(
    ['services/todoDataService', 'modules/page', 'modules/header', 'modules/list', 'modules/statusBar'],
    function() {
        app.init({debug: true});
    }
);


