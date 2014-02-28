"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "heading";

function Heading(){    }
Heading = Gaffa.createSpec(Heading, Gaffa.View);
Heading.prototype.type = viewType;

Heading.prototype.render = function(){
    var textNode = document.createTextNode(''),
        renderedElement = crel('h' + (parseInt(this.level) || 1),textNode);

    this.renderedElement = renderedElement;

    this.text.textNode = textNode;

};

Heading.prototype.text = new Gaffa.Property(function(view, value){
    if(value !== null && value !== undefined){
        this.textNode.textContent = value;
    }else{
        this.textNode.textContent = '';
    }
});

module.exports = Heading;