(function (undefined) {
    var actionType = "filter",
        gaffa = window.gaffa;
        
    window.gaffa.actions[actionType] = function (action) {
        var source = action.bindings.source.value,
            filtered = {},
            pathSeperator = gaffa.pathSeparator,
            key,
            item,
            filter;


        if (source && typeof source === "object") {
            if (action.bindings.filter) {
                if (source.isArray) {
                    filtered = [];
                } else {
                    filtered = {};
                }
                for (key in source) {
                    if (source.isArray && isNaN(key)) {
                        continue;
                    }
                    item = source[key];
                    filter = action.bindings.filter.replace(/~/, [action.bindings.source.binding, pathSeperator, key, pathSeperator].join(""));
                    if (gaffa.utils.parseExpression(filter.getNesting("(", ")"), gaffa.model.get())) {
                        if (action.bindings.clone.value) {
                            item = window.gaffa.extend(true, {}, item);
                        }
                        if (source.isArray) {
                            filtered.push(item);
                        } else {
                            filtered[key] = item;
                        }
                    }
                }
            }
        }

        window.gaffa.model.set(action.bindings.target.binding, filtered);
    };
}());