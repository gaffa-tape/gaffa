(function(undefined) {
    var viewType = "calendar";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function resizeCalendar(viewModel){
        var calendar = $(viewModel.renderedElement),
            size = Math.max(300, $(window).height() - calendar.offset().top - 10);
        
        calendar.fullCalendar('option','height', size);
    }
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.events.element = renderedElement;
        
        $(renderedElement).fullCalendar({
            header: {
                right: 'prev,next',
                center: 'month,agendaWeek,agendaDay'
            },
            allDayDefault:false,
            events: function(start, end, callback){
                callback(viewModel.properties.events.value);
            },
            eventClick: function(event){
                gaffa.navigate('edit/' + event.sessionId);
            },
            height: 300,
            defaultView:'agendaWeek',
            windowResize: function(view){
                resizeCalendar(viewModel);
            },
            viewDisplay: function(view){
                viewModel.properties.startDate.binding && window.gaffa.model.set(viewModel.properties.startDate.binding, view.start, viewModel);
            },
            firstHour: new Date().getHours()
        });
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {             
                events: window.gaffa.propertyUpdaters.object(
                    "events",
                    function(viewModel, events){
                        var element = $(viewModel.renderedElement);
                        
                        element.fullCalendar('render').fullCalendar('refetchEvents');
                        resizeCalendar(viewModel);
                    }
                ),
                startDate: window.gaffa.propertyUpdaters.object(
                    "startDate",
                    function(viewModel, startDate){
                        var element = $(viewModel.renderedElement);
                        if(+startDate !== +element.data('fullCalendar').getDate()){
                            element.fullCalendar('gotoDate', startDate);
                        }
                    }
                )
            },
            defaults: {
                viewContainers:{
                    events: []
                },
                properties: {             
                    events: {},      
                    startDate: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();
