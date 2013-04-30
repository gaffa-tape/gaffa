(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.app = factory();
    }
}(this, function(){

	var Gaffa = require('gaffa');

	function app(gaffa){

		var views = gaffa.views,
			actions = gaffa.actions,
			behaviours = gaffa.behavious;

		function createAddTodoForm(){
			var addForm = new views.form(),
				addTodoTextbox = new views.textbox(),
				addTodo = new actions.push(),
				clearNewTodo = new actions.remove();

			addForm.path = '[newTodo]';
			addForm.views.content.add(addTodoTextbox);
			addForm.actions.submit = [addTodo, clearNewTodo];
			addTodoTextbox.classes.value = 'newTodo';
			addTodoTextbox.placeholder.value = 'What needs to be done?';

			addTodoTextbox.value.binding = '[]';

			addTodo.source.binding = '(object "label" [])';
			addTodo.target.binding = '[/todos]';

			clearNewTodo.target.binding = '[]';

			return addForm;
		}

		function createHeader(){
			var header = new views.container(),
				heading = new views.heading();

			heading.text.value = 'todos';

			header.tagName = 'header';
			header.views.content.add([
				heading,
				createAddTodoForm()
			]);

			return header;
		}

		function createTodoTemplate(){
			var todo = new views.container(),
				todoView = new views.container(),
				completedCheckbox = new views.checkbox(),
				label = new views.label(),
				enableEditing = new actions.set(),
				removeButton = new views.button(),
				removeTodo = new actions.remove(),
				editTodoForm = new views.form(),
				finishEditing = new actions.set(),
				editTodoTextbox = new views.textbox();

			completedCheckbox.showLabel.value = false;
			completedCheckbox.classes.value = 'toggle';
			completedCheckbox.checked.binding = '[completed]';

			label.text.binding = '[label]';
			label.actions.dblclick = [enableEditing];

			enableEditing.source.value = true;
			enableEditing.target.binding = '[editing]';

			removeButton.classes.value = 'destroy';
			removeButton.actions.click = [removeTodo];

			removeTodo.target.binding = '[]';

			todoView.classes.value = 'view';
			todoView.views.content.add([
				completedCheckbox,
				label,
				removeButton
			]);

			todo.tagName = 'li';
			todo.classes.binding = '(join "" (? [completed] "completed") (? [editing] "editing"))';
			todo.views.content.add([
				todoView,
				editTodoForm
			]);

			editTodoTextbox.classes.value = 'edit';
			editTodoTextbox.value.binding = '[label]';
			editTodoTextbox.actions.blur = [finishEditing];

			finishEditing.source.value = false;
			finishEditing.target.binding = '[editing]';

			editTodoForm.actions.submit = [finishEditing];

			editTodoForm.views.content.add(editTodoTextbox);

			return todo;
		}

		function createTodoList(){
			var todoList = new views.list();

			todoList.tagName = 'ul';
			todoList.classes.value = 'todoList';
			todoList.path = '[todos]';
			todoList.list.binding = '(? (= [/filter] "all") [] (? (= [/filter] "completed") (filter [] {todo todo.completed}) (filter [] {todo (! todo.completed)})))';
			todoList.list.template = createTodoTemplate();

			return todoList;
		}

		function createMainSection(){
			var mainSection = new views.container(),
				toggleAllCheckbox = new views.checkbox(),
				toggleAll = new actions.set();

			toggleAll.source.binding = '(map [/todos] {todo (apply object (map todo (array) {key (? (= key "checked") [toggleAll] key)})})';
			toggleAll.target.binding = '[/todos]';

			toggleAllCheckbox.showLabel.value = false;
			toggleAllCheckbox.checked.binding = '[toggleAll]';
			toggleAllCheckbox.classes.value = 'toggleAll';
			toggleAllCheckbox.visible.binding = '(> (length [/todos]) 0)';
			toggleAllCheckbox.actions.change = [toggleAll];

			mainSection.tagName = 'section';
			mainSection.classes.value = 'main';

			mainSection.views.content.add([
				toggleAllCheckbox,
				createTodoList()
			]);

			return mainSection;
		}

		function createFooter(){
			var footer = new views.container(),
				todoCount = new views.html(),
				filters = new views.list(),
				filterContainer = new views.container(),
				filter = new views.anchor(),
				activateFilter = new actions.set(),
				clearCompletedButton = new views.button(),
				clearCompleted = new actions.set();

			// This is kinda lame. Haven't spend the time to make it clean yet.
			todoCount.html.binding = '({todosLeft (join "" "<strong>" todosLeft "</strong> item" (? (!= todosLeft 1) "s") " left")} (filter [/todos] {todo (! todo.completed)}).length)';
			todoCount.classes.value = 'todoCount';

			filters.path = '[filters]';
			filters.list.binding = '[]';
			filters.list.template = filterContainer;
			filters.classes.value = 'filters';
			filters.tagName = 'ul';

			// Binding is relative to the item in the list that has been rendered.
			// In this case: filters/{index}/label
			filter.text.binding = '[label]';
			filter.href.binding = '(join "" "#/" [filter])';
			filter.classes.binding = '(? (= [filter] [/filter]) "selected" "")';
			filter.actions.click = [activateFilter];

			filterContainer.views.content.add(filter);
			filterContainer.tagName = 'li';

			// relative to filters/{index}
			activateFilter.source.binding = '[filter]';
			// slash prefixed routes are root references.
			activateFilter.target.binding = '[/filter]';

			clearCompletedButton.path = '[/todos]';
			clearCompletedButton.text.binding = '(join "" "Clear completed (" (filter [] {todo todo.completed}).length ")")';
			clearCompletedButton.classes.value = 'clearCompleted';
			clearCompletedButton.visible.binding = '(!(!(findOne [] {todo todo.completed})))';
			clearCompletedButton.actions.click = [clearCompleted];

			clearCompleted.target.binding = '[]';
			clearCompleted.source.binding = '(filter [] {todo (!todo.completed)})';

			footer.tagName = 'footer';
			footer.views.content.add([todoCount, filters, clearCompletedButton]);
			footer.visible.binding = '(> (length [/todos]) 0)';

			return footer;
		}
		
		function createApp(){
			var appWrapper = new views.container();

			appWrapper.tagName = 'section';
			appWrapper.classes.value = 'todoapp';

			appWrapper.views.content.add([
				createHeader(),
				createMainSection(),
				createFooter()
			]);

			return appWrapper;
		}

		// Default model
		gaffa.model.set({
			filters:[
				{
					label: "All",
					filter: 'all'
				},
				{
					label: "Active",
					filter: 'active'
				},
				{
					label: "Completed",
					filter: 'completed'
				}
			],
			filter: "all",
			todos: [
				{
					label: "Add persistance"
				},
				{
					label: "Enable hash  based navigation"
				},
				{
					label: "Focus edit box when shown"
				},
				{
					label: "Hook up 'all' checkbox"
				}
			]
		});

		gaffa.views.add(createApp());

	}

	return app;

}));