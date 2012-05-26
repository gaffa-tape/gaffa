(function(undefined) {
    var actionType = "navigate",
		href;

    window.gaffa.actions[actionType] = function(action){
		var props = ["url", "model", "post"];
		props.fastEach(function(value, index){
			if (gaffa.utils.propExists(action, value + ".binding")) {
				var binding = action[value];
				
				if (binding && binding.binding !== undefined) {
					if (binding.binding.isArray) {
						binding.binding.fastEach(function (path, index) {
							if (!(binding.value && binding.value.isArray)) {
								binding.value = [];
							}
							binding.binding[index] = gaffa.paths.getAbsolutePath(action.binding, binding.binding[index]);
							
							binding.value[index] = gaffa.model.get(binding.binding[index]);
						});
					} else {
						binding.binding = gaffa.paths.getAbsolutePath(action.binding, binding.binding);
						binding.value = gaffa.model.get(binding.binding);
					}
				}
			}
		});
		
		href = action.url.value;
		
		if (action.url.format && typeof action.url.format === "string") {
			href = action.url.format.format(action.url.value);
		}
		
        gaffa.navigate(href, (action.model && action.model.value), (action.post && action.post.value));
    };
})();