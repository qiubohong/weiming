var debug = false;

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

        if (!isWeixin() && !debug) {
            window.location.href = "./wx.html";
            return;
        }

        if (!debug) {
            var flag = window.localStorage.getItem("20161001_flag");
            if (flag) {
                $(".p1,.p2").remove();
            }
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

    function init() {
        var mySwiper = new Swiper('.swiper-container', {
            noSwiping: true,
            speed: 600,
            noSwipingClass: 'swiper-no-swiping',
            direction: 'horizontal'
        });
        mySwiper.lockSwipes();
        $("#go-btn").click(function() {
            mySwiper.unlockSwipes();
            mySwiper.slideNext();
            mySwiper.lockSwipes();
        });

        $("#vote-btn").click(function() {
            if ($(this).hasClass("sending")) {
                return;
            }
            var paramsArray = $("#form").serializeArray();
            var params = {};
            var option = [];
            for (var i in paramsArray) {
                var obj = paramsArray[i];
                if (obj.name === "options") {
                    option.push(obj.value);
                } else {
                    params[obj.name] = obj.value;
                }
            }

            if (params.name === "") {
                alert("请输入姓名");
                return;
            }
            if (params.sex === -1) {
                alert("请选择性别");
                return;
            }
            if (params.tel === "") {
                alert("请输入电话");
                return;
            }
            if (params.age === "") {
                alert("请输入年龄");
                return;
            }
            if (params.job === "") {
                alert("请输入职业");
                return;
            }

            if (option.length <= 0) {
                alert("请选择球场");
                return;
            }
            params["option"] = option.join(";");
            $(this).addClass("sending").html("提交中...");
            $("#load-cover").show();
            $.ajax({
                url: "/report/save",
                type: "post",
                data: params,
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code != "0") {
                        alert("投票失败，请稍后重试！");
                        return;
                    }
                    mySwiper.unlockSwipes();
                    mySwiper.slideNext();
                    mySwiper.lockSwipes();
                    setTimeout(function() {
                        $("#load-cover").hide();
                    }, 1000);

                    window.localStorage.setItem("20161001_flag","true");
                }
            });
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

/**
 * @description 判断是否在微信打开
 * @return {Boolean} [description]
 */
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
