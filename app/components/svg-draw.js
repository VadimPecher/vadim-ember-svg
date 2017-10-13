import Component from '@ember/component';

export default Component.extend({
    lines:[],
    
    /*model: function(){
        //console.log("model", this.lines);
        return ["20,20 40,25 60,40 80,120 120,140 200,180"];
    },*/
    /*init(){
        this._super(...arguments);
    },*/
    didInsertElement(){
        this.svg = this.$('#svg1');
        this.listenMouse();
        console.log("svg", this.svg);
    },
    listenMouse(){ // traditional action-binding doesn't allow to get original event object (X and Y)
        this.svg.bind("mousedown", (e) => { this.mouseHandler(e); });
        this.svg.bind("mouseup", (e) => { this.mouseHandler(e); });
    },
    mouseHandler(event){
        if (event.type == "mousedown") { // some promblems with some event coordinates
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
        if (event.type != "mouseup") currentLine += point.x + "," + point.y + " ";
        
        switch(event.type){
            case "mousedown":
                this.svg.bind("mousemove", (e) => { this.mouseHandler(e); });
                break;
            case "mousemove":
                break;
            case "mouseup":
                this.svg.off();
                this.listenMouse();
                if (currentLine.split(",").length <= 2) {
                    currentLine += (point.x + 3) + "," + point.y; // for simple clicks
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
