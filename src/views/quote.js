//    Properties:
//        text: quote
//        cite: citation
//        citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
            renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite))[0];
                
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
                    $(viewModel.renderedElement).children('p').html(value);
                }),
                cite: window.gaffa.propertyUpdaters.string("cite", function(viewModel, value){
                    $(viewModel.renderedElement).find('cite').html(value);
                }),
                citeHref: window.gaffa.propertyUpdaters.string("citeHref", function(viewModel, value){
                    var anchor = $(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank');
                    $(viewModel.renderedElement).find('cite').empty().append(anchor);
                }),
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                            {
                                case "right":
                                    element.addClass("pull-right");
                                    break;
                                case "left":
                                    element.addClass("pull-left");
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            },
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();