"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "html";

function Html(){}
Html = Gaffa.createSpec(Html, Gaffa.View);
Html.prototype.type = viewType;

Html.prototype.render = function(){
    var classes = viewType;

    var renderedElement = crel('span');

    this.renderedElement = renderedElement;

};

Html.prototype.html = new Gaffa.Property(function(viewModel, value){
    viewModel.renderedElement.innerHTML = (typeof value === 'string' || typeof value === 'number') ? value : null;
});

module.exports = Html;