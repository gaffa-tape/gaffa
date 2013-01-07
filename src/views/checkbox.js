(function(undefined) {
    var gaffa = window.gaffa,
        viewType = "checkbox",
		cachedElement;
    
    function Checkbox(){
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Checkbox = gaffa.createSpec(Checkbox, gaffa.ContainerView);
    Checkbox.prototype.type = viewType;
    
    Checkbox.prototype.render = function(){
         var classes = viewType;
        
        var renderedElement = document.createElement('span'),        
            label = document.createElement('label'),
            checkboxId = parseInt(Math.random() * 100000), //Dodgy as.... don't like it? submit a pull request.
            checkbox = $(document.createElement('input')).attr('type', 'checkbox').attr('id', checkboxId)[0];
        
        $(checkbox).bind(this.updateEventName || "change", function(event){
            var viewModel = $(this).parent()[0].viewModel;
            window.gaffa.propertyUpdaters.bool(viewModel, viewModel.checked, $(this).is(":checked"));            
        });     
        label.setAttribute('for', checkboxId);
        renderedElement.appendChild(checkbox);
        renderedElement.appendChild(label);
        renderedElement.className = classes;
		
        this.views.content.element = label;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Checkbox.prototype.checked = new gaffa.Property(function() {   
        if(this.checked.value){
            $(this.renderedElement).children('input').attr("checked", "checked");      
        }else{
            $(this.renderedElement).children('input').removeAttr("checked");      
        }
    });
    Checkbox.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
        if(value !== null && value !== undefined){
            $(viewModel.renderedElement).find('label').text(value);
        }else{
            $(viewModel.renderedElement).find('label').text("");
        }
    }));
    
    gaffa.views[viewType] = Checkbox;
    
})();