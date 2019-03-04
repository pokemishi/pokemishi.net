var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 
// プレイヤーを埋め込む場所(IDを指定)
var ytArea = 'video';
// 埋め込むYouTube動画のID
var ytID = 'iV2YmKMq_7Q'; // https://youtu.be/〇〇〇の〇〇〇
 
// プレイヤーの埋め込み
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player(ytArea, {
    videoId: ytID,
    playerVars: {
      rel: 0, // 関連動画の非表示
      controls: 0, // プレイヤーコントロールの非表示
      showinfo: 0, // タイトルなどの非表示
      modestbranding: 1, // YouTubeロゴの非表示
      iv_load_policy: 3, // アノテーションの非表示
      wmode: 'transparent',
      loop: 1,
      playlist: ytID
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
 
// 動画の準備完了後の動作
function onPlayerReady(e) {
  ytPlayer.playVideo();
  ytPlayer.mute();
  ytPlayer.setPlaybackQuality('default'); // 画質(small・medium・large・hd720・hd1080・highres・default)
  ytPlayer.setPlaybackRate(0.5);
}
 
// 動画再生中と再生後の動作
function onPlayerStateChange(e) {
  var ytStatus = e.target.getPlayerState();
  if (ytStatus == YT.PlayerState.PLAYING) { //再生中
    progressComplete();
  }
  if (ytStatus == YT.PlayerState.ENDED) { //再生後
    ytPlayer.playVideo();
    ytPlayer.mute();
  }
}

// errorの発生時
function onPlayerError(event) {
  var errorstatus = event.data;
  var playerWrap = $('#video');
  //何らかのエラーステータスが渡された場合、youtubeプレイヤーを削除する
  if (errorstatus !== '') {
    $(playerWrap).remove();
    setTimeout(progressComplete, 1500);
  }
}
 
// 上下左右に出てくる黒帯を非表示
var WIN = $(window);
var WIN_H
var win_W
 
function yt_screen_retio(){
  WIN_H = WIN.height();
  WIN_W = WIN.width();
  var screen_switch = 0.5625;
  var screen_ratio = WIN_H / WIN_W;
  var ratio_H = WIN_H / screen_switch;
  var ratio_W = WIN_W * screen_switch;
 
  if(screen_ratio > screen_switch){
    $('#video').css({
      'height':'100%',
      'width':ratio_H,
      'margin-top':'0',
      'margin-left': -ratio_H /2,
      'left':'50%',
      'top':'0'
    });
  } else {
    $('#video').css({
      'width':'100%',
      'height':ratio_W,
      'margin-top': -ratio_W / 2,
      'margin-left':'0',
      'top':'50%',
      'left':'0'
    });
  }
}
 
WIN.resize(function () {
  yt_screen_retio();
});
 
$(function(){
  yt_screen_retio();
});

// 動画読み込み完了時の処理
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