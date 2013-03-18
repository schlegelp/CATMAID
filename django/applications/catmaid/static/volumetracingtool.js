/**
* Volume tracing tool
*/
var canvasLayer;
function VolumeTracingTool()
{
    var self = this;
    var lastSize = 16;
    this.stack = null;
    this.toolname = "Volume Tracing Tool";
    //var canvasLayer = null;
    this.brush = null;
    this.isDragging = false;
    this.traceArray = new Array();
    
    this.registerToolbar = function()
    {
        self.brush_slider = new Slider(SLIDER_HORIZONTAL, true, 1, 100, 100, lastSize,
            self.changeSlice);
        document.getElementById("toolbar_volseg").style.display = "block";    
        var slider_box = document.getElementById("volseg_radius_box");
        
        while (slider_box.firstChild)
        {
            slider_box.removeChild(slider_box.firstChild);
        }
        
        var slider_b_box = document.createElement("div");
        slider_b_box.className = "box";
        slider_b_box.id = "volseg_b_box";
        var slider_b_box_label = document.createElement("p");
        slider_b_box_label.appendChild(document.createTextNode("Paintbrush size" + "     "))
        slider_b_box.appendChild(slider_b_box_label);
        slider_b_box.appendChild(self.brush_slider.getView());
        slider_b_box.appendChild(self.brush_slider.getInputView());
        slider_box.appendChild(slider_b_box);
        
        self.mouseCatcher = document.createElement("div");
        self.mouseCatcher.className = "sliceMouseCatcher";
        self.mouseCatcher.style.cursor = "default";
    };
    
     /*
    ** Create the canvas layer using fabric.js
    */
    this.createCanvasLayer = function ()
    {
        canvasLayer = new CanvasLayer( self.stack, self );
        
        var h = canvasLayer.canvas.getHeight();
        var w = canvasLayer.canvas.getWidth();
        self.brush = new fabric.Circle({top: 200, left: 200, radius: self.brush_slider.val,
            fill: 'blue'});
        canvasLayer.canvas.add(self.brush);
        canvasLayer.canvas.interactive = true;
        
        self.stack.addLayer("VolumeCanvasLayer", canvasLayer);
        self.stack.resize();
        
        canvasLayer.canvas.on({
            'mouse:down' : function(e) {
                self.isDragging = true;
            },
            'mouse:up' : function(e) {
                self.isDragging = false;
            }
        });
        
    }
    
    this.destroyToolbar = function()
    {
        lastSize = self.brush_slider.val;
        document.getElementById("toolbar_volseg").style.display = "none";        
        self.brush_slider.update(0, 1, undefined, 0, null);
    };
    
    this.register = function(parentStack)
    {
        self.stack = parentStack;
        self.registerToolbar();
        self.createCanvasLayer();
        document.getElementById("toolbar_volseg").style_display = "block";        
        self.mouseCatcher.onmousemove = onmousemove.pos;
        self.mouseCatcher.onmousedown = onmousedown;
        self.mouseCatcher.onmouseup = onmouseup;
        self.stack.getView().appendChild(self.mouseCatcher);
        //alert('Registered Volume Tool');
        return;
    };
    
    this.unregister = function()
    {
        
        if (self.stack && self.mouseCatcher.parentNode == self.stack.getView())
        {
            self.stack.getView().removeChild(self.mouseCatcher);
        }
        //alert('Unregistered Volume Tool');
        return;
    };
    
    this.destroy = function()
    {
        document.getElementById("toolbar_volseg").style.display = "none";  
        self.stack.removeLayer( "VolumeCanvasLayer" );
        canvasLayer.canvas.clear();

        canvasLayer = null;

        self.stack = null;
        self.unregister();
        self.destroyToolbar();
        //alert('Destroyed Volume Tool');
        return;
    };

    this.handleKeyPress = function(e)
    {
        return false;
    };
    
    this.changeSlice = function(val)
    {
        statusBar.replaceLast("VRad: " + val);
        self.brush.set({'radius': val});
        canvasLayer.canvas.renderAll();
        //self.brush.setCoords();
        return;
    };
    
    this.resize = function(width, height)
    {
        self.mouseCatcher.style.width = width + "px";
        self.mouseCatcher.style.height = height + "px";
        return;
    };
    
    var onmousedown = function(e)
    {
        self.isDragging = true;
        statusBar.replaceLast("Mouse Down");
    }
    
    var onmouseup = function(e)
    {
        self.isDragging = false;
        statusBar.replaceLast("Mouse Up");
    }
    
    var onmousemove = 
    {
        pos: function(e)
        {
            var m = ui.getMouse(e, self.stack.getView());
            if (m)
            {
                var xp = self.stack.translation.x + ( self.stack.x + ( m.offsetX - 
                    self.stack.viewWidth / 2 ) / self.stack.scale );
                var yp = self.stack.translation.y + ( self.stack.y + ( m.offsetY - 
                    self.stack.viewHeight / 2 ) / self.stack.scale );
                var pos_x = xp * self.stack.resolution.x;
                var pos_y = yp * self.stack.resolution.y;
                statusBar.replaceLast( "[" + pos_x.toFixed( 3 ) + ", " + pos_y.toFixed( 
                    3 ) + " nm] = [" + xp + ", " + yp + " px]" );
                
                self.brush.set({'left': m.offsetX, 'top': m.offsetY});
                
                if (self.isDragging)
                {
                    var spot = self.brush.clone();
                    self.traceArray.push(spot);
                    canvasLayer.canvas.add(spot);
                }
                
                canvasLayer.canvas.renderAll();

            }
            return false;
        }        
    };
    
}