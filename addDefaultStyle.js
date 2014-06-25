function addDefaultStyle(style){
    defaultViewStyles = defaultViewStyles || (function(){
        defaultViewStyles = crel('style', {type: 'text/css', 'class':'dropdownDefaultStyle'});

        //Prepend so it can be overriden easily.
        var addToHead = function(){
            if(window.document.head){
                window.document.head.insertBefore(defaultViewStyles);
            }else{
                setTimeout(addToHead, 100);
            }
        };

        addToHead();

        return defaultViewStyles;
    })();

    if (defaultViewStyles.styleSheet) {   // for IE
        defaultViewStyles.styleSheet.cssText = style;
    } else {                // others
        defaultViewStyles.innerHTML += style;
    }
}

module.exports = addDefaultStyle;