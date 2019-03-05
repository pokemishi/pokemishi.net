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
      ua = navigator.userAgent.toLowerCase();

  // iOS表示不具合対応
  if (ua.indexOf('iphone') > 0 || ua.indexOf('ipad') > 0) {
    // background:fixedが効かない問題の対処
    $('#video-background').css({
      backgroundAttachment: 'scroll'
    });
    removeVideo();
  }

  // IE表示不具合対応
  if (ua.indexOf('msie') > 0 || ua.indexOf('trident') > 0) {
    // background-clip:textが無効なので書き換え
    $skill.find('h3').css({
      background: 'none',
      color: '#1464b4'
    });
    removeVideo();
  }

  // 動画背景が表示されない場合の処理
  function removeVideo() {
    $('#video').remove();
    setTimeout(progressComplete, 1500);
  }

  // #skill h3のbackgroundPositionを個別に変える
  $flexItems.each(function() {
    var left = ($(this).position().left / $skill.outerWidth()) * 100,
        top  = ($(this).position().top / $skill.outerHeight()) * 100,

        // 柄を綺麗に出すための調整用数値
        leftAdjust = 40,
        topAdjust = 20;

    $(this).find('h3').css({
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

    // iPhoneオーバースクロール時にvideo部分が見えてしまうのを防止
    if(positionTop > $works.position().top) {
      $('#video-background').css({
        background: '#000',
        zIndex: -2
      });
    } else {
      $('#video-background').css({
        background: "url('./img/star_bg.jpg') 50% /cover no-repeat",
        zIndex: -4
      });
    }

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