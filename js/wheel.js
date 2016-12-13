(function ($){
	
	  var c = $('#canvas');
      var ct = c.get(0).getContext('2d');
		$(window).resize( respondCanvas );
	
	 var wheelRoundedSize,
		 centerXCordinate,
		 centerYCordinate,
		 fontSize;
	 
	  function respondCanvas(){
		 var windWidth = $(window).width();
		 if(windWidth <= 400) {
			 c.attr('width', 300); //max width
			 c.attr('height', 300); //max height
			 wheelRoundedSize = 130;
			  centerXCordinate = 150;
		 	  centerYCordinate = 150; 
			  fontSize = '1em';
		  }
		 else if(windWidth <= 480) {
			 c.attr('width', 400); //max width
			 c.attr('height', 400); //max height
			 wheelRoundedSize = 130;
			  centerXCordinate = 150;
		 	  centerYCordinate = 150; 
			  fontSize = '1em';
		  }
		 else if(windWidth <= 560) {
			 c.attr('width', 460); //max width
			 c.attr('height', 460); //max height
			 wheelRoundedSize = 190;
			  centerXCordinate = 200;
		 	  centerYCordinate = 200; 
			  fontSize = '1.3em';
		  }else{
			c.attr('width', 490 ); //max width
        	c.attr('height', 490); //max height
			 wheelRoundedSize = 221;
			 centerXCordinate = 247;
		 	 centerYCordinate = 224;
			 fontSize = '2em'; 
		 }
	  }
		  
        //Call a function to redraw other content (texts, images etc)
    
	 respondCanvas();
	
    var venues =  [{"point":"34560"},
				   {"point":"245678"},
				   {"point":"80000"},
				   {"point":"6000"},
				   {"point":"7000"},
				   {"point":"8000"},
				   {"point":"9000"},
				   {"point":"62000"},
				   {"point":"60700"},
				   {"point":"60030"},
				   {"point":"60007"},
				   {"point":"023456"},
				   {"point":"66000"},
				   {"point":"60800"},
				   {"point":"60200"},
				   {"point":"460660"},
				   {"point":"1234"}
				  ];
    // Helpers
    var blackHex = '#b2b2b2',
        whiteHex = '#fff',
        shuffle = function(o) {
            for ( var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                ;
            return o;
        },
        halfPI = Math.PI / 2,
        doublePI = Math.PI * 2;
      	
	String.prototype.hashCode = function(){
		// See http://www.cse.yorku.ca/~oz/hash.html		
		var hash = 17,
            i;
		for (i = 0; i < this.length; i++) {
			char = this.charCodeAt(i);
			hash = ((hash<<16)+hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	};

	Number.prototype.mod = function(n) {
		return ((this%n)+n)%n;
    };
    
// WHEEL!
	var wheel = {
		timerHandle : 0,
		timerDelay : 33,

		angleCurrent : 0,
		angleDelta : 0,

		size : wheelRoundedSize,
		canvasContext : null,

		/*colors : ["#B8D430", "#3AB745", "#029990", "#3501CB",
                 "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                 "#F35B20", "#FB9A00", "#FFCC00", "#FEF200", "#FFCC00","#FFCC00","#FFCC00","#FFCC00",'#673A7E'],
	*/
		colors : ['#910055','#ff0000','#ff00f0','#ba00ff', '#6000ff','#0012ff','#0072ff','#00d2ff','#00ffde','#00ff84','#00ff06','#aeff00','#ffde00','#ff9c00','#ff6000','#ff4200','#820091' ],
		segments : [],

		seg_colors : ['#910055','#ff0000','#ff00f0','#ba00ff', '#6000ff','#0012ff','#0072ff','#00d2ff','#00ffde','#00ff84','#00ff06','#aeff00','#ffde00','#ff9c00','#ff6000','#ff4200','#820091' ], // Cache of segments to colors
		
		maxSpeed : Math.PI / 16,

		upTime : 1000, // How long to spin up for (in ms)
		downTime : 5000, // How long to slow down for (in ms)

		spinStart : 0,

		frames : 0,

		centerX : centerXCordinate,
		centerY : centerYCordinate,

		spin : function() {
			// Start the wheel only if it's not already spinning
			if (wheel.timerHandle == 0) {
				wheel.spinStart = new Date().getTime();
				wheel.maxSpeed = Math.PI / (16 + Math.random()); // Randomly vary how hard the spin is
				wheel.frames = 0;
				//wheel.sound.play();

				wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
			}
		},

		onTimerTick : function() {
			
            var duration = (new Date().getTime() - wheel.spinStart),
                progress = 0,
                finished = false;

			wheel.frames++;
			wheel.draw();

			if (duration < wheel.upTime) {
				progress = duration / wheel.upTime;
				wheel.angleDelta = wheel.maxSpeed
						* Math.sin(progress * halfPI);
			} else {
				progress = duration / wheel.downTime;
				wheel.angleDelta = wheel.maxSpeed
						* Math.sin(progress * halfPI + halfPI);
                if (progress >= 1){
                    finished = true;
                }
			}
			wheel.angleCurrent += wheel.angleDelta;
            while (wheel.angleCurrent >= doublePI){
				// Keep the angle in a reasonable range
				wheel.angleCurrent -= doublePI;
            }
			if (finished) {
				clearInterval(wheel.timerHandle);
				wheel.timerHandle = 0;
				wheel.angleDelta = 0;
				console.log(wheel.drawNeedle('winner'));
                if (console){ console.log((wheel.frames / duration * 1000) + " FPS"); }
			}

			/*
			// Display RPM
			var rpm = (wheel.angleDelta * (1000 / wheel.timerDelay) * 60) / (Math.PI * 2);
			$("#counter").html( Math.round(rpm) + " RPM" );
			 */
		},
		init : function(optionList) {
			try {
				wheel.initWheel();
				//wheel.initAudio();
				wheel.initCanvas();
				wheel.draw();

				$.extend(wheel, optionList);

			} catch (exceptionData) {
				alert('Wheel is not loaded ' + exceptionData);
			}

		},
		/*initAudio : function() {
			var sound = document.createElement('audio');
			sound.setAttribute('src', 'wheel.mp3');
			wheel.sound = sound;
		},*/

		initCanvas : function() {
			var canvas = $('#canvas')[0];
			canvas.addEventListener("click", wheel.spin, false);
			wheel.canvasContext = canvas.getContext("2d");
			var spin = document.getElementById("spin");
			spin.addEventListener("click", wheel.spin, false);
			
		},

		initWheel : function() {
			shuffle(wheel.colors);
		},

		// Called when segments have changed
		update : function() {
			// Ensure we start mid way on a item
			//var r = Math.floor(Math.random() * wheel.segments.length);
			var r = 0,
                segments = wheel.segments,
			    len      = segments.length,
                colors   = wheel.colors,
			    colorLen = colors.length,
                seg_color = ['#910055','#ff0000','#ff00f0','#ba00ff', '#6000ff','#0012ff','#0072ff','#00d2ff','#00ffde','#00ff84','#00ff06','#aeff00','#ffde00','#ff9c00','#ff6000','#ff4200','#820091' ], // Generate a color cache (so we have consistant coloring)
				seg_images = [],
				seg_img = ['coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin' ,'coin'];
                i
            wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * doublePI;
           for (i = 0; i < len; i++){
			  
			   	seg_color.push( colors [ segments[i].hashCode().mod(colorLen) ] );
			    var imageObj = new Image(); // new instance for each image
			    imageObj.src = "images/"+seg_img[i]+".png";
			   seg_images.push(imageObj);
			  // console.log(seg_images);
            }
			wheel.seg_color = seg_color;
			wheel.seg_images = seg_images;
			
			wheel.draw();
		},

		draw : function() {
			wheel.clear();
			wheel.drawWheel();
			//wheel.drawNeedle();
		},

		clear : function() {
			wheel.canvasContext.clearRect(0, 0, 500, 500);
		},
		drawNeedle : function(w) {
		var ctx = wheel.canvasContext,
                centerX = wheel.centerX,
				centerY = wheel.centerY,
                size = wheel.size,
                i,
                centerSize = centerX + size,
                len = wheel.segments.length,
                winner;

				ctx.lineWidth = 0;
				ctx.strokeStyle = blackHex;
				ctx.fillStyle = whiteHex;
			// Which segment is being pointed to?
			i = len - Math.floor((wheel.angleCurrent / doublePI) * len) - 3;
			// Now draw the winning name
			ctx.textAlign = "right";
			ctx.textBaseline = "right";
			ctx.fillStyle = blackHex;
			//ctx.font = "1em Arial";
			winner = wheel.segments[i] || 'Choose at least 1 Venue';
			//ctx.fillText(winner, centerSize + 22, centerY);
		
			return winner;
		},
		
		drawSegment : function(key, lastAngle, angle) {
			var ctx = wheel.canvasContext,
                centerX = wheel.centerX,
                centerY = wheel.centerY,
                size = wheel.size,
                colors = wheel.seg_color,
                value = wheel.segments[key];
				
			//ctx.save();
			ctx.beginPath();
			// Start in the centre
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw an arc around the edge
			//ctx.lineTo(centerX, centerY); // Now draw a line back to the centre
			// Clip anything that follows to this area
			//ctx.clip(); // It would be best to clip, but we can double performance without it
			ctx.closePath();
			ctx.fillStyle = colors[key];
			ctx.fill();
			ctx.stroke();
			
			// Now draw the text
			ctx.save(); // The save ensures this works on Android devices
			ctx.translate(centerX, centerY);
			ctx.rotate((lastAngle + angle) / 2);
			ctx.fillStyle = whiteHex;
			
			ctx.fillText(value.substr(0, 20), size-30, 0);
			ctx.restore();
			ctx.save();
		
				images = wheel.seg_images[key];
				images.onload = function(){
				// ctx.drawImage(images,100,100);
			}
			
		},
		
		drawImage:  function(key, lastAngle, angle) {
				
			   
				//ctx.fillRect(0,0, 50, 50);
		},
		drawWheel : function() {
			var ctx = wheel.canvasContext,
                angleCurrent = wheel.angleCurrent,
                lastAngle    = angleCurrent,
                len       = wheel.segments.length,
                centerX = wheel.centerX,
                centerY = wheel.centerY,
                size    = wheel.size,
                angle,
                i;
			
			ctx.lineWidth    = 0;
			ctx.strokeStyle  = blackHex;
			ctx.textBaseline = "middle";
			ctx.textAlign    = "right";
			ctx.font         = fontSize+" Arial";
			 ctx.shadowColor   = '#666';
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur    = 2;
				
			for (i = 1; i <= len; i++) {
				angle = doublePI * (i / len) + angleCurrent;
				wheel.drawSegment(i - 1, lastAngle, angle);
			    wheel.drawImage(i - 1, lastAngle, angle);
				lastAngle = angle;
			}
            
			// Draw a center circle
			ctx.beginPath();
			//ctx.arc(centerX, centerY, 20, 0, doublePI, false);
			ctx.closePath();

			ctx.fillStyle   = whiteHex;
			//ctx.strokeStyle = blackHex;
			ctx.fill();
			ctx.stroke();

			// Draw outer circle
			ctx.beginPath();
			//ctx.arc(centerX, centerY, size, 0, doublePI, false);
			ctx.closePath();

			ctx.lineWidth   = 0;
			//ctx.strokeStyle = blackHex;
			ctx.stroke();
		}
	};
    $(function() {
        var $venues = $('#venues'),
            $venueName = $('#name'),
           
            venueTypes = [],
            $list = $('<ul/>'),
            $types = $('<ul/>'),
            $filterToggler = $('#filterToggle'),
            arrayUnique = function(a) {
                return a.reduce(function(p, c) {
                    if (p.indexOf(c) < 0) { p.push(c); }
                    return p;
                }, []);
            };

		$.each(venues, function(index, venue) {
			$list.append(
		        $("<li/>")
		        .append(
	                $("<input />").attr({
                         id:    'venue-' + index
                        ,name:  venue.point
                        ,value: venue.point
                        ,type:  'checkbox'
                        ,checked:true
	                })
	                .change( function() {
	                	var cbox = this,
                            segments = wheel.segments,
                            i = segments.indexOf(cbox.value);

	                	if (cbox.checked && i === -1) {
	                		segments.push(cbox.value);
	                	} else if ( !cbox.checked && i !== -1 ) {
	                		segments.splice(i, 1);
	                	}

	                	segments.sort();
	                	wheel.update();
	                })

		        ).append(
	                $('<label />').attr({
	                    'for':  'venue-' + index
	                })
	                .text( venue.name )
		        )
		    );
            venueTypes.push(venue.type);
		});
        $.each(arrayUnique(venueTypes), function (index, venue){
            $types.append(
		        $("<li/>")
		        .append(
	                $("<input />").attr({
                         id:    'venue-type-' + index
                        ,name:  venue
                        ,value: venue
                        ,type:  'checkbox'
                        ,checked:true
	                })
	                .change( function() {
                        var $this = $(this), i;
                        for(i=0; i<venues.length;i++){
                            if (venues[i].type === $this.val()){
                                $('[name="'+venues[i].name+'"]').prop("checked",$this.prop('checked')).trigger('change');
                            }
                        }
	                })

		        ).append(
	                $('<label />').attr({
	                    'for':  'venue-' + index
	                })
	                .text( venue )
		        )
		    )
        });
        
        $venueName.append($list);
        //$venueType.append($types);
        // Uses the tinysort plugin, but our array is sorted for now.
		//$list.find('>li').tsort("input", {attr: "value"});
        
        wheel.init();

		$.each($venueName.find('ul input:checked'), function(key, cbox) {
			wheel.segments.push( cbox.value );
		});

		wheel.update();
        $venues.slideUp().data("open",false);
        $filterToggler.on("click", function (){
            if($venues.data("open")){
                $venues.slideUp().data("open",false);
            }else{
                $venues.slideDown().data("open",true);
            }
        });
        
        $('.checkAll').on("click", function (){
            $(this).parent().next('div').find('input').prop('checked',$(this).prop('checked')).trigger("change");
        });
	});
}(jQuery));