app.addModule('page', function(context) {
    
    'use strict';
    
    return {
        
        init: function() {
            this.bindHashChange();
        },
        
        bindHashChange: function() {
            window.addEventListener('hashchange', function(event) {
                event.preventDefault();
                context.broadcast('todo:stateChanged', {hash: location.hash});
            });
        }
        
    };
    
});