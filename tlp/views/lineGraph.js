//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "lineGraph";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = document.createElement('div');

        renderedElement.className = classes;

        $(renderedElement).kendoChart({
            seriesDefaults: {
                type: "line"
            },
            tooltip: {
                visible: true,
                format: "{0} Kgs"
            }
        });

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                title: function (viewModel, value) {
                        value = viewModel.properties.title.value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            var title = "",
                            chartData = $(element).data("kendoChart").options;

                            if (value !== undefined) {
                                title = value.toString();
                            }

                            chartData.title.text = title;

                            $(element).kendoChart(chartData);
                        }
                },
                data: function (viewModel, value, firstRun) {                    
                    value = viewModel.properties.data.value;
                    var element = viewModel.renderedElement;
                    if (element) {
                        var chartData = $(element).data("kendoChart").options;

                        chartData.series[0] = { data: value };

                        $(element).kendoChart(chartData);

                        setTimeout(function () {
                            $(element).data('kendoChart').refresh();
                        }, 50);
                    }                    
                },
                categories: function (viewModel, value, firstRun) {
                    value = viewModel.properties.categories.value;
                    var element = viewModel.renderedElement;
                    if (element) {
                        var chartData = $(element).data("kendoChart").options;

                        chartData.categoryAxis.categories = value;

                        $(element).kendoChart(chartData);
                    }
                }
            },
            defaults: {
                properties: {
                    visible: {},
                    title: {},
                    data: {},
                    categories: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();