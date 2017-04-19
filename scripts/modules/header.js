app.addModule('header', function(context) {
    
    'use strict';
    
    return {
        onsubmit: function(event, element, elementType) {
            var inputEl = context.element.querySelector('form input');
            var todoTitle = inputEl.value.trim();
            
            event.preventDefault();
            
            if(todoTitle.length) {
                context.broadcast(
                    'todo:added',
                    {id: context.getService('todoDataService').add(todoTitle)}
                );
                
                inputEl.value = '';
            }
        }
    };
    
});