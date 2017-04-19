app.addService('todoDataService', function() {
    
    'use strict';
    
    var todos = {};
    var counter = 0;
    
    return {
        getOne: function() {
            
        },
        getAll: function() {
            return todos;
        },
        add: function(title) {
            var todoId = ++counter;
            
            todos[todoId] = {
                id: todoId,
                title: title,
                completed: false
            };
            
            return todoId;
        },
        edit: function() {
            
        },
        remove: function(id) {
            if(todos[id]) {
                delete todos[id];
            }
        },
        removeCompleted: function() {
            var self = this;
            
            Object.keys(todos).forEach(function(id) {
                if(todos[id].completed) {
                    self.remove(id);
                }
            });    
        },
        markAsComplete: function(id) {
            if(todos[id]) {
                todos[id].completed = true;
            }
        },
        markAsIncomplete: function(id) {
            if(todos[id]) {
                todos[id].completed = false;
            }
        },
        markAllAsComplete: function() {
            var self = this;
            
            Object.keys(todos).forEach(function(id) {
                self.markAsComplete(id);
            });
        },
        markAllAsIncomplete: function() {
            var self = this;
            
            Object.keys(todos).forEach(function(id) {
                self.markAsIncomplete(id);
            });
        }
    };

});