$(document).ready(function() {
    /**
     * 初始化
     */
    (function() {
        var $audio_state = 0;
        var baseFont = 18,
            baseWidth = 360;
        var cw = $(window).width();
        var fs = (cw / baseWidth * baseFont);
        if (IsLandScape() && cw >= 1600) {
            fs = 18;
            $("#body-content").width(600);
        }

        document.body.style.fontSize = fs + 'px';
        $('html').css('fontSize', document.body.style.fontSize);

        $('.loader .hide').removeClass('hide');
        var img = new Image();
        img.src = "img/load.png";
        img.onload = function() {
            preloadResourceEvent();
        };
    })();

    /**
     * 页面提前加载其他资源事件
     */
    function preloadResourceEvent() {
        //打算加载的资源池
        var resourceList = [
            "img/bg.png",
            "img/1.png",
            "img/3.png"
        ];
        var imgNum = 0;

        var loader = $('.loader');
        var progressEle = document.querySelector('.loader-text');
        var progressCircle = new ProgressBar.Circle('.loader-icon', {
            color: '#fff',
            duration: 0,
            // trailColor: "#35B5D2",
            easing: 'easeInOut',
            strokeWidth: 3,
            progress: 0
        });
        $.imgpreload(resourceList, {
            each: function() {
                var status = $(this).data('loaded') ? 'success' : 'error';
                if (status == "success") {
                    imgNum++;
                    if (imgNum <= 1) {
                        return;
                    }
                    var v = (parseFloat(imgNum) / (resourceList.length)).toFixed(2);
                    var score = Math.round(v * 100);
                    if (score > 100) {
                        score = 100;
                    }
                    progressCircle.animate(score / 100, {
                        from: {},
                        to: {},
                        step: function(state, bar) {
                            progressEle.innerHTML = (bar.value() * 100).toFixed(0) + '%';
                            bar.path.setAttribute('stroke', state.color);
                        }
                    });
                }
            },
            all: function() {
                $('.loader').addClass('hide');
                $('.body-content').removeClass('hide');

                $('img').each(function() {
                    this.onload = this.onerror = function(argument) {
                        this.style.backgroundColor = 'transparent';
                    };
                });
                
                init();
            }
        });
    }

    function init(){
        var mySwiper = new Swiper('.swiper-container', {
            noSwiping: true,
            speed: 600,
            noSwipingClass: 'swiper-no-swiping',
            direction: 'horizontal'
        });

        $("#go-btn").click(function(){
            mySwiper.slideNext();
        });
    }
});

/**
 * @description 判断是否为pc端
 */
function IsLandScape() {
    var flag = true;
    if (document.body.clientWidth > document.body.clientHeight) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
}