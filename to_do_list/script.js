jQuery(function ($) {

	window.$ = document.querySelectorAll.bind(document);
	window.$$ = document.querySelector.bind(document);

function App(list, view) {
	this.list = list;
	this.view = view;
	this.storage = new Storage(list);
}

App.prototype.update = function() {
	this.view.update();
}

App.prototype.deleteItem = function(id) {
	var item = this.list.getItem(id)
	this.list.deleteItem(item);
	this.update();
}

App.prototype.toggleComplete = function(id) {
	var item = this.list.getItem(id);
	item.completeItem();
	this.update();
}

function View(list, deleted) {
	this.list = list;
	this.deleted = deleted;
	this.template = ''
		+ '<li id="{{id}}" class="{{completed}}">\n\t'
		+		'<span class="task">{{task}}</span>\n\t'
		+		'<input type="checkbox" class="icon toggle" {{checked}} />\n\t'
		+		'<input type="button" class="icon delete" />\n'
		+	'</li>\n';
}


View.prototype.generateHTML = function() {
		var data = this.list.items;
		var dataLength = this.list.countItems();
		var html = '';
		for (i=0; i < dataLength; i++) {
			var template = this.template;
			var completed = '';
			var checked = '';
			
			if (data[i].completed == true) {
				completed = 'completed';
				checked = 'checked';
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{task}}', data[i].task);
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);	
			html = html + template;
		}
		return html;
	}

View.prototype.update = function() {
	var html = this.generateHTML()
	$(".todoList").html(html);
	return true;
}	

function Storage(list) {
	this.list = list;
}

function List(title) {
	this.title = title;
	this.items = [];
}

List.prototype.countItems = function() {
	return this.items.length;
}

List.prototype.addItem = function(item) {
	this.items.push(item);
}

List.prototype.getItem = function(id) {
	for (var i=0; i < this.items.length; i++) {
		if (this.items[i].id == id) {
			return this.items[i];
		}
	}
}

List.prototype.deleteItem = function(item) {
	for (var i=0; i < this.items.length; i++) {
		if (this.items[i] == item) {
			this.items.splice(i, 1)
		}
	}
}

function Item(task, completed) {
	date = new Date();
	this.task = task;
	this.addedOnDate = Math.floor(Date.now()/1000);
	this.completed = false;
	this.completedOnDate = null;
	this.id = Math.random().toString(36).slice(-7);
}

Item.prototype.completeItem = function() {
	if (this.completed) {
		this.completed = false;
		this.completedOnDate = null;
	} else {
		this.completed = true;
		this.completedOnDate = Math.floor(Date.now()/1000);
	}
}


//Run This Code

	var list = new List("Tasks");
	var page = new View(list);

	var app = new App(list, page)
	app.update();


	$$('.todoList').addEventListener('click', function (click) {
		var target = click.target;
		var id = target.parentNode.id;
		if (target.className.indexOf('delete') > -1) {
			app.deleteItem(id);
		}
		if (target.className.indexOf('toggle') > -1) {
			app.toggleComplete(id);
		}
	});

	$( "div.newItem form" ).submit( function() {
		var text = $( ".newTask" ).val();
		if (text == '') {
			return false;
		}
		var newItem = new Item(text, false)	
		list.addItem(newItem);
		this.reset();
		app.update();
		return false;
	});



});