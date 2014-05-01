/* 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * watermark.js - Create watermarked images with Canvas and JS
 *
 * Version: 1 (2011-04-04)
 * Copyright (c) 2011	Patrick Wied ( http://www.patrick-wied.at )
 * This code is licensed under the terms of the MIT LICENSE
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

(function(w){
	var wm = (function(w){
		var doc = w.document,
		gcanvas = {},
		gctx = {},
		imgQueue = [],
		className = "watermark",
		scale = 1,
		watermark = false,
		watermarkPosition = "bottom-right",
		watermarkPath = "watermark.png?"+(+(new Date())),
		opacity = (255/(100/50)), // 50%
		initCanvas = function(){
			gcanvas = doc.createElement("canvas");
			gcanvas.style.cssText = "display:none;";
			gctx = gcanvas.getContext("2d");
			doc.body.appendChild(gcanvas);
		},
		initWatermark = function(){
			watermark = new Image();
			watermark.src = "";
			watermark.src = watermarkPath;
			
			if(opacity != 255){
				if(!watermark.complete)
					watermark.onload = function(){	
						applyTransparency();
					}
				else
					applyTransparency();
				

			}else{
				applyWatermarks();
			}
			
		},
		// function for applying transparency to the watermark
		applyTransparency = function(){
			var w = watermark.width || watermark.offsetWidth,
			h = watermark.height || watermark.offsetHeight;
			setCanvasSize(w, h);
			gctx.drawImage(watermark, 0, 0);
					
			var image = gctx.getImageData(0, 0, w, h);
			var imageData = image.data,
			length = imageData.length;
			for(var i=3; i < length; i+=4){  
				imageData[i] = (imageData[i]<opacity)?imageData[i]:opacity;
			}
			image.data = imageData;
			gctx.putImageData(image, 0, 0);
			watermark.onload = null;
			watermark.src = "";
			watermark.src = gcanvas.toDataURL();
			// assign img attributes to the transparent watermark
			// because browsers recalculation doesn't work as fast as needed
			watermark.width = w;
			watermark.height = h;

			applyWatermarks();
		},
		configure = function(config){
			if(config["watermark"])
				watermark = config["watermark"];
			if(config["path"])
				watermarkPath = config["path"];
			if(config["position"])
				watermarkPosition = config["position"];
			if(config["opacity"])
				opacity = (255/(100/config["opacity"]));
			if(config["className"])
				className = config["className"];
			
			initCanvas();
			initWatermark();
		}
		setCanvasSize = function(w, h){
			gcanvas.width = w;
			gcanvas.height = h;
		},
		applyNewImg = function(config){
			if(config["watermark"])
				watermark = config["watermark"];
			if(config["path"])
				watermarkPath = config["path"];
			if(config["position"])
				watermarkPosition = config["position"];
			if(config["opacity"]){
				opacity = (255/(100/config["opacity"]));
				if(opacity != 255){
					if(!watermark.complete){
							applyTransparency();
					}else{
						applyTransparency();
					}
				}
			}
			if(config["className"])
				className = config["className"];
			if(config["img"]){
				gcanvas = doc.getElementsByTagName("canvas")[0];
				image = new Image;
				image.src = config["img"];
				doc.getElementsByTagName("img")[0].src = image.src;
			}
			initCanvas();
			initWatermark();
		},
		applyWatermark = function(img){
			gcanvas.width = img.width || img.offsetWidth;
			gcanvas.height = img.height || img.offsetHeight;
			gctx.drawImage(img, 0, 0);
			if (scale<1)
				gctx.scale(scale,scale);
			var position = watermarkPosition,
			x = 0,
			y = 0;
			if(position.indexOf("top")!=-1)
				y = 10;
			else
				if(scale<1)
					y = (gcanvas.height-watermark.height*scale)*(10-(10*scale))+ 1000*(scale);
				else
					y = gcanvas.height-watermark.height - 10;
			if(position.indexOf("left")!=-1)
				x = 10;
			else
				if(scale<1)
					x = (gcanvas.width-watermark.width*scale)*(10-(10*scale)) + 1000*(scale);
				else
					x = gcanvas.width-watermark.width-10;
			console.log(gcanvas.width);
			console.log("h: "+ watermark.height);
			console.log("w: "+watermark.width);
			console.log("x: "+x);
			console.log("y: "+y);
			gctx.drawImage(watermark, x, y);
			img.onload = null;
			console.log(gcanvas);
			img.src = gcanvas.toDataURL();

		},
		applyWatermarks = function(){
			setTimeout(function(){
				var els = doc.getElementsByClassName(className),
				len = els.length;
				while(len--){
					var img = els[len];
					if(img.tagName.toUpperCase() != "IMG")
						continue;
					
					if(!img.complete){
						img.onload = function(){
							applyWatermark(this);
						};
					}else{
						applyWatermark(img);
					}
				}
			},10);
		};
		
		
		return {
			init: function(config){
				configure(config);
			},
			apply: function(config){
				applyNewImg(config);
			}
		};
	})(w);
	w.wmark = wm;
})(window);