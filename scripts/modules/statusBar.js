app.addModule('statusBar', function(context) {
    
    'use strict';
    
    var self, todosDB, moduleEl;
    
    return {
    
        messages: ['todo:added', 'todo:removed', 'todo:statusChanged', 'todo:stateChanged', 'todo:checkAllBtnClicked'],
        
        init: function() {
            self = this;
            moduleEl = context.getElement();
            todosDB = context.getService('todoDataService');
        },
        
        onmessage: function(name, data) {
            switch(name) {
                case 'todo:added':
                case 'todo:removed':
                case 'todo:statusChanged':
                    self.updateTodosCount();
                    break;
                case 'todo:stateChanged':
                    self.setActiveFilter(data.hash);
                    break;
            }
        },
        
        onclick: function(event, element, elementType) {
            if(elementType === 'clearBtn') {
                todosDB.removeCompleted();
                context.broadcast('todo:removed');
            }
        },
        
        onchange: function(event, element, elementType) {
            if(elementType === 'selectAllCheckbox') {
                if(element.checked) {
                    todosDB.markAllAsComplete();
                } else {
                    todosDB.markAllAsIncomplete();
                }
            }
            
            context.broadcast('todo:checkAllBtnClicked');
        },
        
        updateTodosCount: function() {
            var todos = todosDB.getAll();
            var todosCount = Object.keys(todos).length;
            var completedCount = self.getCompletedTodosCount(todos); 
            
            self.updateItemsLeft(todosCount - completedCount);
        },
        
        updateItemsLeft: function(itemsLeft) {
            moduleEl.querySelector('.itemsLeft').innerHTML = itemsLeft;
        },
        
        setActiveFilter: function(hash) {
            var filters = moduleEl.querySelectorAll('.filter a');
            
            filters.forEach(function(filter) {
                if(hash === filter.getAttribute('href')) {
                    filter.classList.add('labelActive');
                } else {
                    filter.classList.remove('labelActive');
                }
            });
        },
        
        getCompletedTodosCount: function(todos) {
            var completedCount = 0;
            
            Object.keys(todos).forEach(function(id) {
                if(todos[id].completed) {
                    completedCount++;
                }
            });
            
            return completedCount;
        },

    };

});