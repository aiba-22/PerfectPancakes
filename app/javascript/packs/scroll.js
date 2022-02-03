$(function(){
    //#aboutをクリックした時だけ作動する
    //#とするとページ内移動が全て適用されるがカルーセルの画像移動も適用されてしまう。
    $('a[href^="#about"]').click(function(){
      //スクロールのスピード
      var speed = 500;
      //リンク元を取得
      var href= $(this).attr("href");
      //リンク先を取得
      var target = $(href == "#" || href == "" ? 'html' : href);
      //リンク先までの距離を取得
      var position = target.offset().top;
      //スムーススクロール
      $("html, body").animate({scrollTop:position}, speed, "swing");
      return false;
    });
  });
