module.exports = function(){
    function InputView(){}
    InputView = createSpec(InputView, View);

    function Enabled(){};
    Enabled = createSpec(Enabled, Property);
    Enabled.prototype.value = true;
    Enabled.prototype.update = function(viewModel, value) {
        viewModel.renderedElement[value ? 'setAttribute':'removeAttribute']('enabled', 'enabled');
    };
    InputView.prototype.enabled = new Enabled();

    function Value(){};
    Value = createSpec(Value, Property);
    Value.prototype.update = function(viewModel, value) {
        viewModel.renderedElement.setAttribute('value', value);
    };
    InputView.prototype.enabled = new Value();

    function Placeholder(){};
    Placeholder = createSpec(Placeholder, Property);
    Placeholder.prototype.update = function(viewModel, value) {
        viewModel.renderedElement[value ? 'setAttribute':'removeAttribute']('placeholder', value);
    };
    InputView.prototype.placeholder = new Placeholder();

    function Required(){};
    Required = createSpec(Required, Property);
    Required.prototype.update = function(viewModel, value) {
        viewModel.renderedElement[value ? 'setAttribute':'removeAttribute']('required', value);
    };
    InputView.prototype.required = new Required();
}