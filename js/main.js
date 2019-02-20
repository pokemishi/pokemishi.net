$(function() {

  var $anchors   = $('header > nav > ul > li'),
      $toTheTop  = $('#toTheTop'),

      $main      = $('#main'),
      $skill     = $('#skill'),
      $works     = $('#works'),
      $sns       = $('#sns'),
      $flexItems = $skill.find('.flex-item'),

      positionTop = 0,
      scrolling = false,
      threshold,
      ua = navigator.userAgent;

  // iOSでbackground:fixedが効かない問題の対処
  if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0) {
    $('#video-background, #sns').css({
      backgroundAttachment: 'scroll'
    });
  }

  // #skill h2のbackgroundPositionを個別に変える
  $flexItems.each(function(i) {
    var left = ($(this).position().left / $skill.outerWidth()) * 100,
        top  = ($(this).position().top / $skill.outerHeight()) * 100,

        // 柄を綺麗に出すための調整用数値
        leftAdjust = 40,
        topAdjust = 20;

    $(this).find('h2').css({
      backgroundPosition: (left + leftAdjust) + '% ' + (top + topAdjust) + '%'
    });
  });

  // リンクをcurrentにする処理
  function classChange(active) {
    $anchors.find('a').removeClass('current');

    switch (active) {
      case 0: $anchors.eq(0).find('a').addClass('current');
              break;
      case 1: $anchors.eq(1).find('a').addClass('current');
              break;
      case 2: $anchors.eq(2).find('a').addClass('current');
              break;
    }
  };

  // リサイズ時にウィンドウの高さを再取得する
  $(window).on('resize', function() {
    threshold = $(this).height() / 3;
  });

  // スクロール時の処理
  $(window).on('scroll', $.throttle(1000 / 15, function() {
    if (scrolling) return;
    var positionTop = $(this).scrollTop();

    // 右下トップに戻るボタンの表示・非表示
    if (positionTop < threshold) {
      $toTheTop.fadeOut('slow');
    } else {
      $toTheTop.fadeIn('slow');
    };

    // startedクラスのみが付いているものをcurrentにする
    if($main.hasClass('started') && !$main.hasClass('ended')) {
      classChange(-1);
    } else if($skill.hasClass('started') && !$skill.hasClass('ended')) {
      classChange(0);
    } else if($works.hasClass('started') && !$works.hasClass('ended')) {
      classChange(1);
    } else if($sns.hasClass('started') && !$sns.hasClass('ended')) {
      classChange(2);
    }
  }));

  // リンクをクリックしたときの処理
  $('a[href^="#"]').click(function(e) {
    e.preventDefault();

    if ($(this).hasClass('current')) return;

    var speed = 400;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;

    if (href === '#') {
      classChange(-1);
    } else {
      classChange($(this).closest($anchors).index());
    }

    scrolling = true;

    $('body,html').stop().animate({scrollTop:position}, speed, 'swing', function() {
      scrolling = false;
    });

  });

  $(window).trigger('resize').trigger('scroll');
});