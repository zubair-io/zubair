
    var debug_el = $("#debug");
    function debug(text) {
        debug_el.text(text);
    }


    /**
     * requestAnimationFrame and cancel polyfill
     */
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());


    /**
    * super simple carousel
    * animation between panes happens with css transitions
    */
    function Carousel(element)
    {
        var self = this;
        element = $(element);

        var container = $(">ul", element);
        var panes = $(">ul>li", element);

        var pane_width = 0;
        var pane_count = panes.length;

        var current_pane = 0;


        /**
         * initial
         */
        this.init = function() {
            setPaneDimensions();

            $(window).on("load resize orientationchange", function() {
                setPaneDimensions();
                //updateOffset();
            })
        };


        /**
         * set the pane dimensions and scale the container
         */
        function setPaneDimensions() {
            pane_width = element.width();
            panes.each(function() {
                $(this).width(pane_width);
            });
            container.width(pane_width*pane_count);
        };


        /**
         * show pane by index
         * @param   {Number}    index
         */
        this.showPane = function( index ) {
            // between the bounds
            index = Math.max(0, Math.min(index, pane_count-1));
            current_pane = index;

            var offset = -((100/pane_count)*current_pane);
            setContainerOffset(offset, true);
        };


        function setContainerOffset(percent, animate) {
            container.removeClass("animate");

            if(animate) {
                container.addClass("animate");
            }

            if(Modernizr.csstransforms3d) {
                container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            }
            else if(Modernizr.csstransforms) {
                container.css("transform", "translate("+ percent +"%,0)");
            }
            else {
                var px = ((pane_width*pane_count) / 100) * percent;
                container.css("left", px+"px");
            }
        }

        this.next = function() { return this.showPane(current_pane+1, true); };
        this.prev = function() { return this.showPane(current_pane-1, true); };



        function handleHammer(ev) {
            console.log(ev);
            // disable browser scrolling
            ev.gesture.preventDefault();

            switch(ev.type) {
                case 'dragright':
                case 'dragleft':
                    // stick to the finger
                    var pane_offset = -(100/pane_count)*current_pane;
                    var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                    // slow down at the first and last pane
                    if((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
                        (current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
                        drag_offset *= .4;
                    }

                    setContainerOffset(drag_offset + pane_offset);
                    break;

                case 'swipeleft':
                    self.next();
                    ev.gesture.stopDetect();
                    break;

                case 'swiperight':
                    self.prev();
                    ev.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                        if(ev.gesture.direction == 'right') {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                    else {
                        self.showPane(current_pane, true);
                    }
                    break;
            }
        }

        element.hammer({ drag_lock_to_axis: true })
            .on("release dragleft dragright swipeleft swiperight", handleHammer);
    }


 //   var carousel = new Carousel("#carousel");
  //  carousel.init();
function ok(){
        $.getJSON('js/small.js', function(data) {
  var items = [];
     $("#main").css( "opacity", "0" );
  
 
  setTimeout(function(){
      
     $("#main").html(""); 
  
  
  
 
$("#main").html("<div id='carousel'></div>");
 
 
  $.each(data.gallery, function(key, val) {
       style ="style='background-image: url("+val.image+");"+
"background-repeat: no-repeat;"+
"background-size: contain;"+
"background-position: center center;'"

about ="<div class='about'>"+
"<h2>" + val.title +"</h2>"+
"<p>" + val.description +"</p>"+
"</div>";


    items.push('<li '+style+'class="image" id="' + key + '">' + about + '</li>');
  });
 
  $('<ul/>', {
    'class': 'hero-unit',
    html: items.join('')
  }).prependTo('#carousel');

var carousel = new Carousel("#carousel");
   carousel.init();
    $("#main").css( "opacity", "1" );
  
 
  },500);
   
});





    
}


$(function() {
    $.getJSON('js/gallery.js', function(data) {
  var items = [];

 
 
  $.each(data.gallery, function(key, val) {
       style ="style='background-image: url("+val.image+");"+
"background-repeat: no-repeat;"+
"background-size: contain;"+
"background-position: center center;'"
    items.push('<li '+style+'class="items" id="' + key + '">' + val.title + '</li>');
  });
 
  $('<ul/>', {
    'class': 'hero-unit',
    html: items.join('')
  }).prependTo('#main');
 $(".items").click(function () {
      ok();
    });

    });

window.addEventListener("hashchange", setUrl, false);


  
});
function setUrl(){
        
      var hash = location.hash;
hash = hash.replace( /^#/, '' )

//alert (hash);
  history.pushState(null, "Zubair", hash);
        
    }
