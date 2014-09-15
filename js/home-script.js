 $(function() {
        Boxlayout.init();
    });

    $(document).ready(function() {
        $('body').addClass('ready');
    });

    // Tweens
    var cover = $("#start"),
        square = $(".square"),
        btn = $("#go-to-select");

    //animate squares


    function setSquares() {
        for (i = 0; i < square.length; i++) {
            var newq = makeNewPosition();
                el = $(square[i]);
                el.css('top', newq[0]);
                el.css('left', newq[1]);
                transform = 'rotateX('+newq[4] +'deg) rotateY('+newq[3]+') scale('+newq[2]+')';
               // el.css('transform', transform);
        } 
    }

    setSquares();
    animateDiv();    


    function animateDiv() {
        for (i = 0; i < square.length; i++) {
            elem = $(square[i]);
            tween(elem);
        }
    };


     function tween($el) {
        var newq = makeNewPosition();

        TweenMax.to($el, newq[5], {top:newq[0], 
                            left:newq[1],  
                            rotationY:newq[4],
                            rotationX:newq[3],
                            scale:newq[2],
                            onComplete:animateDiv,
                            ease: Ease.easeInQuad
                        }); 
    };


   function makeNewPosition(){
        
        // Get viewport dimensions (remove the dimension of the div)
        var h = $(window).height() - 30;
        var w = $(window).width() - 30;
        var min = -360;
        var max = 360;
        var smax = 20;
        var smin = 2;

        // and the formula is:
        var nrx = Math.floor(Math.random() * (max - min + 1)) + min;
        var nry = Math.floor(Math.random() * (max - min + 1)) + min;
        
        var nh = Math.floor(Math.random() * h);
        var nw = Math.floor(Math.random() * w);
        var ns = Math.random();
        var nsp = Math.floor(Math.random() * (smax - smin + 1)) + smin;
        return [nh,nw,ns,nrx,nry,nsp];            
    };

  



   // animate words
   $(function(){
            
            var $words = $(".word");

            //settings
            var transitionTime = 0.4;
            var wordsDelayTime = 1.5;
            
            //internal
            var totalWords = $words.length;
            
            var oldWord = 0;
            var currentWord = -1;
            
            //initialize    
            switchWords();
            
            function switchWords(){
                
                oldWord = currentWord;
                
                if(currentWord < totalWords-1){
                    currentWord ++
                } else {
                    currentWord = 0;
                }
                
                TweenLite.to($words.eq(oldWord), transitionTime, {top:-20, alpha:0, rotationX: 90});
                TweenLite.fromTo($words.eq(currentWord), transitionTime, {top:20, alpha:0, rotationX: -90 }, {top:0, alpha:1, rotationX:0});
                
                TweenLite.delayedCall(wordsDelayTime, switchWords);
            }       
    });


    // go to select
    btn.on("click", function(){
        TweenLite.to(cover, 1, {top:"-100%", ease:Back.easeInOut});
        $('html').addClass('show-select');
    });    

