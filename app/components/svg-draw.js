import Component from '@ember/component';

export default Component.extend({
    
    lines:[],
    
    didInsertElement() {
        
        this.svg = this.$('#svg1');
        this.listenMouse();
    },
    
    listenMouse() { // traditional action-binding doesn't allow to get original event object (X and Y)
        
        this.svg.bind("mousedown", (e) => { this.mouseHandler(e); });
        this.svg.bind("mouseup", (e) => { this.mouseHandler(e); });
        this.svg.bind("mouseout", (e) => { this.mouseHandler(e); });
    },
    
    mouseHandler(event) {
        
        if (event.type == "mousedown") { // due to promblems with some event coordinates
            this.ownPos = {
                x:event.originalEvent.offsetX - event.originalEvent.layerX,
                y:event.originalEvent.offsetY - event.originalEvent.layerY
            } 
        }
        var point = {
            x: event.originalEvent.layerX + this.ownPos.x,
            y: event.originalEvent.layerY + this.ownPos.y
        }; 
        
        var currentLine = event.type == "mousedown" ? "" : this.lines.popObject();
        
        if (event.type != "mouseup" && event.type != "mouseout") 
            currentLine += point.x + "," + point.y + " ";
        
        switch(event.type) {
            case "mousedown":
                this.svg.bind("mousemove", (e) => { this.mouseHandler(e); });
                break;
            case "mousemove":
                break;
            case "mouseup":
            case "mouseout":
                this.svg.off();
                this.listenMouse();
                if (currentLine.split(",").length <= 2) { // for simple clicks - draw a point
                    currentLine += (point.x + 3) + "," + point.y; 
                }
                //console.log(this.lines.length, currentLine);
                break;
        }
        
        this.lines.pushObject(currentLine);
    },
    
    actions: {
        
        undo() {
            this.lines.popObject();
        },
        
        clear() {
            this.lines.clear();
        }
    }
});
