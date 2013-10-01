# gaffa.js

## Dependencies

Gaffa must be compiled with browserify [browserify](https://github.com/substack/node-browserify)

## Example app

[Gaffa-ToDo](https://github.com/KoryNunn/gaffa-todo)

[Live Example](https://rawgithub.com/KoryNunn/gaffa-todo/master/index.html)


## Quick n easy setup

    npm install gaffa-boilerplate
    
Then make a folder for your test project.

    gaffa-boilerplate
    
This will copy some boilerplate files and start a file watcher that browserifys app.js, in the scripts folder.

## Overview
Gaffa attempts to speed up the development of complicated UI's by providing a rich binding layer between abitrary data and your UI.

Writing UI's using gaffa is unlike most other MVC/MVVM/etc frameworks for a number of different reasons. (Although, others share some of the below points)

* ASAP databinding - model change events are instantaneous
* Extremely powerful model bindings - use complex expressions to bind to data
* UI by transform  - Use transforms over data to affect how data is displated, rather than modifying the data to suite the UI.
* NO HTML! - Javascript to DOM, no pointless middleman.
* Serialise to JSON - An entire application can be serialised to JSON, by design.
* No lock-in - Push your views to the edge of Gaffa's capabilities, and break out whenever you need.

### Minimal usage

	var Gaffa = require('gaffa'),
		gaffa = new Gaffa();

### The Bits..

A Gaffa application consists of 2 high-level bits:

* Many ViewItems
* One model

### ViewItems

ViewItems can be **Views**, **Actions**, or **Behaviours**.

ViewItems represent and can affect the model, they are combined to create a UI.

a View is a ViewItem that has a renderedElement, be it some DOM, or any other abstract UI element, such as a google maps pin object.

To use a view, you must first load the constructor for that view. For example, to use a label, and a textbox, the label.js and textbox.js files must be required(). Every viewItem must be added to its appropriate constructors object in gaffa, eg:

	// Add viewItem constructors to gaffa. Only use what you need.

	// Views
	gaffa.views.constructors = {
		label: require('gaffa/views/label'), 
		textbox: require('gaffa/views/textbox'), 
		button: require('gaffa/views/button')
	};

	// Actions
	gaffa.actions.constructors = {
		remove: require('gaffa/actions/remove')
	};

	// Behaviours
	gaffa.actions.constructors = {
		pageLoad: require('gaffa/behaviours/pageLoad')
	};

For ease of development, the constructors are usually assigned to a variable:

	// Cache the view constructors object to easy access later.
	var views = gaffa.views.constructors;

viewItems can then be instantiated:

	// New up a label
	var nameLabel = new views.label(),
		firstNameBox = new views.textbox(),
		surnameBox = new views.textbox(),
		removeUserButton = new views.button();

an Action is a non-visual entity which performs some action when executed. For example, an action could be assigned to be triggered when a button is clicked, and it could set a value into the model, or remove an item from an array.

	var removeUser = new actions.remove();

To assign actions to a view:

	removeUserButton.actions.click = [removeUser];

Gaffa will automatically use the actions.*whatever* propertyName as a DOM event name, and trigger any actions assigned when that event occurs.

a Behaviour is a non-visual entity that triggers actions. For example, a modelChange behaviour could be created to watch a property in the model, and assigned actions to perform when the value of that property changes. 

### The Model

The Model is just a Javascript object. If you can serialize it to JSON, and it inherrits from Object, it is a valid gaffa model, and it can be bound to. Unlike most similar frameworks, Gaffa focuses on keeping the model pure. If you add an object to the model, that exact object is used throughout the whole lifecycle, with no extra attributes like "Observable" etc. It's just a plain old object.

These are valid models:

	{};

	new Date();

	[];

However usually a model would look something like this:

	var model = {
		users:[
			{
				firstName: "John",
				surname: "Smith",
				age: 30,
				lastVisit: (a date object)
			}
		]
	};

This can be set as the applications model by:

	gaffa.model.set(model);

You can also set parts of the model using paths.

	gaffa.model.set('[users/0/firstName]', 'Bob');

This will cause properties bound to this value to update.

You would very rarely use this syntax to affect the model, but rather use bound viewItem properties to change model data. This method of affecting the model is mostly used for debugging.

You can bind ViewItems properties to parts of the model using paths, eg:

	// Bind the firstName box to the users first name in the model
	firstNameBox.value.binding = '[user/firstName]';

	// Bind the surname box to the users surname in the model
	surnameBox.value.binding = '[user/surname]';

	// Bind the nameLabel to an expression that joins both names together.
	nameLabel.text.binding = '(join " " [user/firstName] [user/surname])';

Once you have set up your viewItems, you can add them to the application.
Calling gaffa.views.add(viewItem) on a viewItem binds and renders the view. No properties will be bound to the model untill this has occured.

	// Add the views to gaffa
	gaffa.views.add([
		nameLabel,
		firstNameBox,
		surnameBox
	]);

### Expressions

Gaffa uses Gedi as its model, and as such, uses Gedi's expressions.

Expressions in gaffa are used to address the model in some way.

For a more in-depth explanation of expressions, checkout the gedi readme: [Gedi](https://github.com/gaffa-tape/gedi)


## License
(The MIT License)

Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
