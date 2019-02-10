$(function() {

  var top = document.getElementById('top'),
      linkSec1 = document.getElementById('linkSec1'),
      linkSec2 = document.getElementById('linkSec2'),
      linkSec3 = document.getElementById('linkSec3'),
      linkSec4 = document.getElementById('linkSec4'),
      linkSec5 = document.getElementById('linkSec5'),
      toTheTop = document.getElementById('toTheTop'),

      section0 = document.getElementById('section0'),
      section1 = document.getElementById('section1'),
      section2 = document.getElementById('section2'),
      section3 = document.getElementById('section3'),
      section4 = document.getElementById('section4'),
      section5 = document.getElementById('section5'),

      scrolling = false,
      positionTop = 0,
      section1OffsetTop = $(section1).offset().top / 3;

  // リンクをcurrentにする処理
  function classChange(sec1, sec2, sec3, sec4, sec5) {
    linkSec1.className = sec1 ? 'current' : '';
    linkSec2.className = sec2 ? 'current' : '';
    linkSec3.className = sec3 ? 'current' : '';
    linkSec4.className = sec4 ? 'current' : '';
    linkSec5.className = sec5 ? 'current' : '';
  };

  // スクロールした時の処理
  $(window).on('scroll', $.throttle(1000 / 15, function() {
    // 右下トップに戻るボタンの表示・非表示
    var positionTop = document.documentElement.scrollTop;

    if (positionTop < section1OffsetTop) {
      // cssアニメーションとかぶって変なフェードになるから一旦OFFに
      toTheTop.style.transition = 'none';
      $('#toTheTop').fadeOut('slow', function() {
        toTheTop.style.transition = '';
      });
    } else {
      toTheTop.style.transition = 'none';
      $('#toTheTop').fadeIn('slow', function() {
        toTheTop.style.transition = '';
      });
    };

    if(scrolling) return; // 自動スクロール中は処理しない

    // 手動スクロールしたときに自動的にリンクをcurrentにする
    if(section0.classList.contains('started') && !section0.classList.contains('ended')) {
      classChange(false, false, false, false, false);
    } else if(section1.classList.contains('started') && !section1.classList.contains('ended')) {
      classChange(true, false, false, false, false);
    } else if(section2.classList.contains('started') && !section2.classList.contains('ended')) {
      classChange(false, true, false, false, false);
    } else if(section3.classList.contains('started') && !section3.classList.contains('ended')) {
      classChange(false, false, true), false, false;
    } else if(section4.classList.contains('started') && !section4.classList.contains('ended')) {
      classChange(false, false, false, true, false);
    } else if(section5.classList.contains('started') && !section5.classList.contains('ended')) {
      classChange(false, false, false, false, true);
    }
  }));

  // リンクをクリックしたときにcurrentにする
  top.addEventListener('click', function() {
    scrolling = true;
    classChange(false, false, false, false, false);
  }); 
  linkSec1.addEventListener('click', function() {
    scrolling = true;
    classChange(true, false, false, false, false);
  });
  linkSec2.addEventListener('click', function() {
    scrolling = true;
    classChange(false, true, false, false, false);
  });
  linkSec3.addEventListener('click', function() {
    scrolling = true;
    classChange(false, false, true, false, false);
  });
  linkSec4.addEventListener('click', function() {
    scrolling = true;
    classChange(false, false, false, true, false);
  });
  linkSec5.addEventListener('click', function() {
    scrolling = true;
    classChange(false, false, false, false, true);
  });
  
  // リンクをクリックしたときの自動スクロール
  $('a[href^="#"]').click(function() {
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing', function() {
      scrolling = false;
    });
    return false;
  });

  $(window).trigger('scroll');
});