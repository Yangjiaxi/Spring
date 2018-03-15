$(function ()
{
  var curPageNum = 1;
  var totalPages = 10;
  var lock = 0;
  var screenHeight;
  var $bigBox = $("#bigBox");
  var $body = $("body");
  var $join = $("#join");
  initAll();

  function bindTouch (e, f)
  {
    e.on("touchstart", function (e1)
    {
      $(this).on("touchend", function (e2)
      {
        var det = e2.changedTouches[0].clientY - e1.changedTouches[0].clientY;
        if (det <= 50 && det >= -50) f();
      });
    });
  }

  function initAll ()
  {
    console.log("Welcome!");
    resize();
    document.addEventListener("mousewheel", scroll);
    $(window).on("resize", resize);
    $(window).on("orientationchange", resize);
    bindTouch($(".next"), function () {doScroll(curPageNum, 1);});
    bindTouch($(".wantLink"), showDetail);
    bindTouch($("#toTop"), function ()
    {
      doScroll(curPageNum, -(totalPages - 1));
      setTimeout(function () { lock = 0; }, 800);
    });
    bindTouch($join, function ()
    {
      doScroll(curPageNum, (totalPages - curPageNum));
      setTimeout(function () { lock = 0; }, 800);
    });
    $(document).on("touchstart", touchE);
    clear();
    // doScroll(1, totalPages - 1); //**for test**
  }

  function resize ()
  {
    $(".pages").css("height", window.innerHeight + "px");
    screenHeight = window.innerHeight;
  }

  function afterScroll ()
  {
    if (curPageNum > 1 && curPageNum < totalPages)
    {
      var $sPage = $("#page" + curPageNum);
      $sPage
        .find(".logo")
        .delay(200)
        .animate({top: "10vh"}, 500, "easeOutQuart")
        .delay(300)
        .fadeOut(500);
      $sPage
        .find(".f_logo")
        .delay(200)
        .animate({"right": $(window).width() / 2 - $sPage.find(".f_logo").width() / 2}, 700, "easeOutQuart")
        .delay(100)
        .animate({
            "top": "3vh",
            "left": "5vh"
          }, 500, "easeOutQuart",
          function ()
          {
            $sPage.find(".info").addClass("goIn");
            setTimeout(function ()
            {
              clear();
              lock = 0;
            }, 500);
          });
    }
    else
    {
      clear();
      lock = 0;
    }
  }

  function showDetail ()
  {
    lock = 1;
    var $cPage = $("#page" + curPageNum);
    $cPage.find(".info").removeClass("goIn").fadeOut(500);
    $cPage.find(".want").fadeIn(500, function ()
    {
      $body.one("touchstart", function (e1)
      {
        $body.one("touchend", function (e2)
        {
          var det = e2.changedTouches[0].clientY - e1.changedTouches[0].clientY;
          if (det <= 50 && det >= -50)
          {
            lock = 1;
            $cPage.find(".info").addClass("goIn");
            $cPage.find(".want").fadeOut(500, function () {lock = 0;});
          }
        });
      });
      lock = 0;
    });
  }

  function doScroll (from, act) //act:dir，1 up，-1 down => from + act = to
  {
    if (!lock)
    {
      if (act < 0) //up
      {
        if (curPageNum > 1)
        {
          lock = 1;
          $join.fadeOut();
          $bigBox.animate({top: -((curPageNum += act) - 1) * screenHeight}, 800, "easeOutQuart", afterScroll);
        }
      }
      else //down
      {
        if (curPageNum < totalPages)
        {
          lock = 1;
          $join.fadeOut();
          $bigBox.animate({top: -((curPageNum += act) - 1) * screenHeight}, 800, "easeOutQuart", afterScroll);
        }
      }
    }
  }

  function clear ()
  {
    var $ot = $(".pages").not("#page" + curPageNum);
    $body.off("touchstart");
    $ot.find(".logo").show().css({"top": "", "bottom": "100%"});
    $ot.find(".f_logo").css({"top": "62vh", "left": "", "right": "110%"});
    $ot.find(".info").removeClass("goIn");
    $ot.find(".info").hide();
    $ot.find(".want").hide();
    if (curPageNum < totalPages)
    {
      if (curPageNum === 1) $join.css({"color": "#242424"});
      else $join.css({"color": "white"});
      $join.fadeIn(500);
    }
  }

  function scroll (e)
  {
    if (e.wheelDelta > 120) //up
      doScroll(curPageNum, -1);
    else if (e.wheelDelta < -120)  //down
      doScroll(curPageNum, 1);
  }

  function touchE (ev1)
  {
    ev1.preventDefault();
    var tStart = ev1.changedTouches[0].clientY;
    $(document).one("touchend", function (ev2)
    {
      var tEnd = ev2.changedTouches[0].clientY;
      var det = tEnd - tStart;
      if (det > 50) doScroll(curPageNum, -1);
      else if (det < -50) doScroll(curPageNum, 1);
    });
  }
});

