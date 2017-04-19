app.addModule('list', function(context) {

    'use strict';
    
    var self, moduleEl, tempFn, todosDB, filter;
    
    function getClosestTodoElement(element) {
        var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;
        
        while(element) {
            if(matchesSelector.bind(element)('li')) {
                return element;
            } else {
                return element.parentNode;
            }
        }
        
        return false;
    }
    
    function getClosestTodoId(element) {
        var todoEl = getClosestTodoElement(element);
        return todoEl.getAttribute('data-todo-id');
    }
    
    function setFilterByUrl(hash) {
        filter = hash.replace('#', '');
    }
    
    return {
        
        messages: ['todo:added', 'todo:removed', 'todo:statusChanged', 'todo:stateChanged'],
        
        init: function() {
            self = this;
            filter = 'all';
            moduleEl = context.getElement();
            todosDB = context.getService('todoDataService');
            
            require(['doT'], function(doT) {
                tempFn = doT.template(document.getElementById('todoListTemplate').innerHTML);
            });
        }, 
        
        destroy: function() {
            self = null;
            moduleEl = null;
            tempFn = null;
        },
        
        onmessage: function(name, data) {
            switch(name) {
                case 'todo:added':
                case 'todo:removed':
                    context.broadcast('todo:statusChanged');
                    self.renderList();
                    break;
                case 'todo:stateChanged':
                    setFilterByUrl(data.hash);
                    self.renderList();
                    break;
            }
        },
        
        onclick: function(event, element, elementType) {
            var method = null;
            
            if(elementType === 'delete-btn') {
                method = 'removeTodo';    
            } else if(elementType === 'completed-btn') {
                method = 'markAsComplete';
            }
            
            if(method) {
                var todoEl = getClosestTodoElement(element);
                var todoId = getClosestTodoId(element);
                
                self[method](todoEl, todoId);
                context.broadcast('todo:statusChanged', {id: element.dataset.todoId});
            }
        },
        
        removeTodo: function(todoEl, todoId) {
            moduleEl.removeChild(todoEl);
            todosDB.remove(todoId);
            context.broadcast('todo:removed', {id: todoId});    
        },
        
        markAsComplete: function(todoEl, todoId) {
            if(todoEl.dataset.checked === 'false') {
                this.markChecked(todoEl, todoId);
            } else {
                this.markUnchecked(todoEl, todoId);
            }
        },
        
        renderList: function() {
            self.clearList();
            
            var todos = todosDB.getAll();

            Object.keys(todos).reverse().forEach(function(id) {
                switch(filter) {
                    case 'active':
                        if(todos[id].completed === false) {
                            self.addTodoItem(todos[id]);
                        }
                        break;
                    case 'completed':
                        if(todos[id].completed === true) {
                            self.addTodoItem(todos[id]);
                        }
                        break;
                    default:
                        self.addTodoItem(todos[id]);
                }
            });
        },
        
        clearList: function() {
            moduleEl.innerHTML = '';
        },
        
        addTodoItem: function(todo) {
            moduleEl.innerHTML += tempFn({todo: todo});
        },
        
        markChecked: function(todoEl, todoId) {
            todoEl.dataset.checked = true;
            todoEl.querySelector('.todoText').classList.add('todoLineThrough');
            todoEl.querySelector('.ion-checkmark').classList.remove('hide');
            todosDB.markAsComplete(todoId);
        },
        
        markUnchecked: function(todoEl, todoId) {
            todoEl.dataset.checked = false;
            todoEl.querySelector('.todoText').classList.remove('todoLineThrough');
            todoEl.querySelector('.ion-checkmark').classList.add('hide');
            todosDB.markAsIncomplete(todoId);
        },
        
    };

});
