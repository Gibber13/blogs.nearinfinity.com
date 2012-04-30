Element.addMethods({
    insertCanvas: function(element, insertion) {        
        var canvas = document.createElement('canvas');
        var config = insertion.before || insertion.after || insertion.top || insertion.bottom || insertion;
        canvas.width = config[0];
        canvas.height = config[1];

        if (insertion.before) {
            element.parentNode.insertBefore(canvas, element);
        } else if (insertion.after) {
            var sibling = element.nextSibling;
            if (sibling) {
                element.parentNode.insertBefore(canvas, sibling);
            } else {
                element.parentNode.appendChild(canvas);
            }
        } else if (insertion.top) {
            if (element.childNodes.length == 0) {
                element.appendChild(canvas);
            } else {
                element.insertBefore(canvas, element.childNodes[0]);
            }
        } else {
            element.appendChild(canvas);
        }
        if (!canvas.getContext && G_vmlCanvasManager) {
            G_vmlCanvasManager.initElement(canvas);
        }
        return element;
    }
});