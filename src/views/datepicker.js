(function (undefined) {

    var viewType = "datepicker",
        cachedElement,
        isiPad = navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPhone/i) != null;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes);

        renderedElement.attr('type', 'datetime-local');

        renderedElement.bind(viewModel.updateEventName || (isiPad ? "blur" : "change"), function () {
            window.gaffa.model.set(viewModel.value.binding, this.value, viewModel);                
        });

        return renderedElement[0];
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                value: function (viewModel, firstRun) {
                    var element = $(viewModel.renderedElement),
                        value = viewModel.value.value;
                    if (element) {
                        if (value !== undefined) {
                            element.attr('value', value);                            
                        } else {
                            var now = new Date();
                            element.attr('value', new Date(+now - (now.getTimezoneOffset() * 60000)).toJSON().split('.')[0]);
                            element[isiPad ? "blur" : "change"]();
                        }
                    }
                }
            },
            defaults: {
                properties: {
                    value: {}
                }
            },
            afterInsert: function (viewModel) {
                if (!isiPad) {
                    $(viewModel.renderedElement).hide().scroller({
                        preset: 'datetime',
                        theme: 'android-ics',
                        display: 'inline',
                        mode: 'scroller'
                    });
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();
