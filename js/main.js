$(function() {
  'use strict';

  var $anchors      = $('header > nav > ul > li'),
      $toTheTop     = $('#toTheTop'),

      $main         = $('#main'),
      $skill        = $('#skill'),
      $works        = $('#works'),
      $sns          = $('#sns'), 
      $skillItems   = $skill.find('.skill-item'),
      $workItem     = $works.find('.work-item'),
      $workArrow    = $works.find('.work-detail-arrow'),
      $video        = $main.find('#video'),

      arrowWidth    = $workArrow.outerWidth(),
      currentWork   = -1,
      openDetail    = -1,
      scrolling     = false,
      threshold,
      ua            = navigator.userAgent.toLowerCase(),
      // 読み込みが遅い場合タイムアウト
      timer         = setTimeout(progressComplete, 5000);

  // IE表示不具合対応
  if (ua.indexOf('msie') > 0 || ua.indexOf('trident') > 0) {
    // background-clip:textが無効なので書き換え
    $skill.find('h3').css({
      background: 'none',
      color: '#1464b4'
    });
  }

  // #skill h3のbackgroundPositionを個別に変える
  $skillItems.each(function() {
    var left = ($(this).position().left / $skill.outerWidth()) * 100,
        top  = ($(this).position().top / $skill.outerHeight()) * 100,

        // 柄を綺麗に出すための調整用数値
        leftAdjust = 40,
        topAdjust = 20;

    $(this).find('h3').css({
      backgroundPosition: (left + leftAdjust) + '% ' + (top + topAdjust) + '%'
    });
  });

  // 動画読み込み完了時の処理
  $video.on('canplay', function() {
    clearInterval(timer);
    $(this).get(0).playbackRate = 0.5;
    progressComplete();
  });

  // ロード終了アニメーション
  function progressComplete() {
    var $progress = $('.progress'),
        $progressInner = $progress.find('.progress-inner');

    $progressInner.find('.spinner').css({
      animation: 'spin-complete 1.2s ease-out forwards'
    });
    $progressInner.find('p').text('Complete!').css({
      animation: 'text-complete 1.2s ease-in forwards'
    });
    $progress.find('.progress-top').delay(1700).animate({
      top: '-50%'
    }, 500);
    $progress.find('.progress-under').delay(1700).animate({
      top: '100%'
    }, 500, function() {
      $progress.hide();
    });
  }

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

  // リサイズ時の処理
  $(window).on('resize', function() {
    threshold = $(this).height() / 3;
    updateArrow();
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
      $video.css({
        top: '-100%'
      });
    } else {
      $video.css({
        top: 0
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

  $(window).trigger('resize').trigger('scroll');

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

    $('body,html').stop().animate({scrollTop:position}, speed, function() {
      scrolling = false;
    });
  });

  // worksクリック時の処理
  $workItem.on('click', function() {
    var nextWork           = $(this).index(),
        $nextWorkDetail    = $('#work' + (nextWork + 1)),
        $currentWorkDetail = $('#work' + (currentWork + 1));

    if(currentWork === -1) {
      $nextWorkDetail.slideDown();
      openDetail = 1;
    } else if (currentWork === nextWork) {
      $currentWorkDetail.stop().slideToggle();
      openDetail *= -1;
    } else {
      $nextWorkDetail.insertBefore($currentWorkDetail);
      $currentWorkDetail.slideUp();
      $nextWorkDetail.slideDown();
      openDetail = 1;
    }
    currentWork = nextWork;

    updateArrow();
  });

  // workArrowの位置更新
  function updateArrow() {
    var position;

    if (currentWork === -1 || openDetail === -1) {
      position = -arrowWidth;
    } else {
      position = $workItem.eq(currentWork).position().left + ($workItem.width() / 2) - (arrowWidth / 2);
    }

    $workArrow.stop().animate({
      left: position + 'px'
    }, 300);
  }
});