module.exports = function resolvePath(viewItem){
    if(viewItem && viewItem.getPath){
        return viewItem.getPath();
    }
};