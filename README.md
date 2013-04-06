# gaffa.js

## Dependencies

Gaffa depends on Gedi (https://github.com/gaffa-tape/gedi), which depends on Gel (https://github.com/gaffa-tape/gel).

## Overview
Gaffa is a state management library that helps with highly data-dependant UIs. From a high level, you define how a UI should be layed out, how it should behave, and where in the model its data should come from, and Gaffa makes it all happen.

### Core Principal

Gaffa's core principle is that EVERYTHING is data driven. The UI is there to represent the data nicely, and allow the user to modify the data. If something changes in the UI it was caused by the following reasons:

1. The model changed

Thats it.

The model can change because the user made a change to the UI, which updated the model, or because the page has received new data from the server. A change to the DOM should only occur when the model changes. This ensures the state of the application is completely encapsulated in the model, making state management extremely easy.

### The Goal

The end goal is that you should be able to create a complex data driven UI with no programming ability at all. As of right now, it is possible do this with no knowledge of javascript, by simply defining data structures and JSON definitions, assuming you have all the views you need.

### The Components

A Gaffa application consists of 4 main components:

a Model, a collection of ViewModels, Behaviours, and Actions

Model: "This is the data"  
viewModels: "This is how the app should represent the data"  
Behaviours: "Do an action when the data changes"  
Actions: "Do something to the model"

These things are often combined into an app consisting of a single JSON object, eg:

	{
		Model: {}, //some object
		Views: [ {View 1}, {View 2}], //etc...
		Behaviours:[ {Behaviour 1}] //etc...
	}

an app can be loaded by:

	gaffa.load(myApp);

### Models

The Model is just a Javascript object. If you can serialize it to JSON, it is a valid gaffa model, and it can be bound to. Unlike most similar frameworks, Gaffa focuses on keeping the model pure. If you add an object to the model, that exact object is used throughout the whole lifecycle, with no extra attributes like "Observable" etc. Its just a plain old object.

These are valid models:

	{};

	new Date();

	"hello world";

However usually a model would look something like this:

	{
		Users:[
			{
				Name: "John",
				Age: 30,
				LastVisit: (a date object)
			}
		]
	}

### View Models

Gaffa view models represent and can affect the model. View models are combined to define a layout. This definition is a JSON object that defines a hierarchical structure of the page, similar to HTML. This definition also allows you to set bindings to the model, for example, you can tell a textbox to get and set its value on a property of the model.

A simple layout definition for example:

	[
		//This is a viewModel
		{
			type: "text",
				properties: {
						text:{
							value: "Name"
						}
					}
				},
				//This is also a viewModel
				{
					type: "textbox",
					properties: {
					value:{
					binding: "[Users/0/Name]"
				}
			}
		}
	]

This defines that there should be a text element with the text of "Name", followed by a textbox element whose value is bound to the value in the model at users[0].Name

Note that you can assign a value to a property or a binding. Assigning a value sets that property statically, whereas setting a binding tells gaffa to dynamically query the model for the value.

A viewModel can have actions associated with them that are performed on certain user input.

eg: on click of a button, perform these actions.

### Behaviours

Gaffa behaviours allow you to define what to do when the model changes. For example a behaviour might watch for any changes to the model and kick off a Store action that is configured to store the model to the browser's local storage.

So far there are only 2 behaviours: ModelChange and PageLoad

### Actions

Gaffa actions allow you to do something that affects the model. 

A list of some gaffa actions:

Set: Sets a property on the model from that of a bindable source.
	eg: Set model.name to "John", or Set model.name to model.newName
	
Toggle: Flip the boolean value at a model property

Store: Store the value of a property on the model to some persistable storage
	eg: store the model to http://www.mySite.com/users/save
	or store the model to local storage.
	
Fetch: Retrieve data from some persistable storage, and set a property on the model to that.

## Example

An example app of a simple Todo list: http://gaffa-tape.github.com/  
A highly contrived demo page: http://www.korynunn.com/intro.html

## License
(The MIT License)

Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
