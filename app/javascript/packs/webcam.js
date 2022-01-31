//全体の流れはinit_btnのボタンをクリックした時にカメラの起動が始まり、次に画像解析が始まる
//全て読み込まれてから要素を取り込む
window.addEventListener = function() {
  // labelContainer: フロント側に表示する結果を格納する
  let labelContainer, model;
  // 焼き加減の数値を格納
  var favorite_baking = document.getElementById("favorite_baking");
  var favorite_baking = favorite_baking.getAttribute('value');
  var URL

      //パンケーキの厚さによって解析用画像モデルを変更するので、二つのスタートボタンを用意し分岐させる
      $('#start_btn').on('click', function(){
      //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
        URL = "https://teachablemachine.withgoogle.com/models/gXEpLx0KS/";//パンケーキの厚みが通常の画像を格納したモデル
        init();
      });
      $('#thick_size_start_btn').on('click', function(){
        //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
        URL = "https://teachablemachine.withgoogle.com/models/G3RgTX00-/";//パンケーキが厚めの画像を格納したモデル
        init();
      });

      async function init() {
        $("#point_img").addClass('hide');//initが押されたらうまく焼くポイントの画像を非表示にする
    //変数設定
    //カメラの設定
      let medias;

        medias = {
        audio: false,
        video: {
          facingMode: {
            exact: "environment"
          }
        }
      }

    //DOMに要素追加
      //カメラ映像を出すvideoタグ
        const video = document.getElementById("video");
      //ユーザーのカメラを取得する
        const promise = navigator.mediaDevices.getUserMedia(medias);

    //カメラの起動許可をするとコールバックしてvideoタグにカメラ映像を写す
      promise.then(successCallback)
        .catch(errorCallback);
    //コールバックより実行しvideoオブジェクトにカメラ映像を格納する
      function successCallback(stream) {
        video.srcObject = stream;
        };
    //起動許可がされない時はアラート表示を行う
        function errorCallback(err) {
        alert(err);
        };

      $('#start_btn').addClass('hide');
      $('#thick_size_start_btn').addClass('hide');
      $('#loader').removeClass('hide'); //ローディングアニメーションを表示

    //teachablemachineのモデルURLを読み込む
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

    //モデルのイメージを格納する
      model = await tmImage.load(modelURL, metadataURL);

    //進捗インジケータを見えなくする
      $('#loader').addClass('hide'); //ローディングアニメーションを表示
      $('#result_output_container').removeClass('hide'); //ユーザーに判定結果や操作案内をするコンテナを表示

    //フロント側に表示する結果ラベルをDOMに要素追加する
      labelContainer = document.getElementById("label-container");
    //画像を常に識別し結果を表示するためのループ処理
      window.requestAnimationFrame(loop);
    }

  let baking_status = "not_baked"; //片面の焼きが完了したら反対側の焼きに移行するので、焼き加減の状態を追えるようにを変数を用意する
  let endTime = 0; // 終了時間
  let startTime = 0; // 開始時間
  let elapsedTime; //経過時間
  let cnt = 0;
  let interval;

  async function loop() {
    elapsedTime = performance.now();
    if ((Math.round(elapsedTime - startTime) / 1000) < 30){
      await predict();
      if (baking_status == "baking_completed"){
        window.cancelAnimationFrame(loop);
        first_baking_completed();
      }else{
        window.requestAnimationFrame(loop);
      }
    }else{
      window.cancelAnimationFrame(loop);
      timeup();
    }
  }

  async function timeup(){
    if (await swal('長時間経過したため解析を中断しました。焼きすぎの可能性があるのでパンケーキを確認して下さい。')) {
      location.reload();
    }
  }

  //カメラ画像からgoogleのteachablemachineのモデルより近い画像がどれか判定をしていく
  async function predict(){
  //canvasに静止画を格納する
    var canvas =document.getElementById("canvas");
    //videoの横縦幅とアスペクト比を取得する（サイズによってcanvasへのトリミングを変えるため）
    var videoWidth = video.videoWidth * 0.8;//横幅を取得、少しズームさせたいので0.8をかける
    var videoHeight = video.videoHeight * 0.8;//縦幅を取得、少しズームさせたいので0.8をかける
    var videoRate = videoWidth / videoHeight;//アスペクト比を取得
    var Starting_X; //横の描画スタート位置
    var Starting_Y; // 縦の描画スタート位置

    if(videoRate >= 1){ //画像が横長のとき
      Starting_X = (videoWidth - videoHeight) /2;
      canvas.getContext("2d").drawImage(video, Starting_X, 0, videoHeight, videoHeight, 0, 0, 200, 200); //Canvasに幅を基準に画像を描画
    }else{ //画像が縦長のとき
      Starting_Y = (videoHeight - videoWidth) /2;
      canvas.getContext("2d").drawImage(video, 0, Starting_Y, videoWidth, videoWidth, 0, 0, 200, 200); //Canvasに高さを基準に画像を描画
    }

    const prediction = await model.predict(canvas);
    //数値によってラベルの結果を変更する
    //#{@user}はuserモデルのfavoriteカラム（焼き加減）の数値が入るようになっている
    switch(true){
      case prediction[0].probability.toFixed(2) * favorite_baking >= 0.5:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "まだまだ";
        if (baking_status == "not_baked"){
          startTime = performance.now();
          baking_status = "start_baking";
        }
      break;
      case prediction[1].probability.toFixed(2) * favorite_baking >= 0.8:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "今だ";
        if (baking_status =="start_baking"){
          endTime = performance.now(); // 終了時間
          //最初の焼きが完了すると『もう少し』から『今だ』にかかった時間を測定して次のステップに進ませる
          baking_status = "baking_completed"
        }
      break;
      case prediction[1].probability.toFixed(2) * favorite_baking >= 0.4:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "もう少し";
      break;
      case prediction[2].probability.toFixed(2) >= 0.7:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "PerfectPancakes!!";
        break;
      case prediction[3].probability.toFixed(2) >= 0.8:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "パンケーキを映してください"
        break;
    }
  }

  //次の焼き時間目安を表示させカウントダウンタイマーのボタンを表示させる
  function first_baking_completed(){
    $('#baking_time_result').text(`片面の焼き時間は ${Math.round((endTime - startTime)/1000)}秒でした。次の焼き加減目安は ${Math.round((endTime - startTime) / 1000 * 0.5)}秒です。パンケーキをひっくり返したらスタートを押してください。`);
    $('#baking_time_result').removeClass('hide');
    $('#second_baking_button').removeClass('hide');
    $('canvas').addClass('hide');
    $('#first_baking_completed_img').removeClass('hide');
  }

  //カウントダウンをスタートさせると1秒ごとにcountupを作動させる
  $('#second_baking_button').on('click', function() {
    $('#baking_time_result').addClass('hide');
    $('#second_baking_button').addClass('hide');
    interval = setInterval(countup, 1000);
  });
  //タイマーを表示させて0になったら終了する
  function countup(){
    cnt++;
    labelContainer.innerHTML = `2回目のひっくり返しまであと${Math.round((endTime - startTime) / 1000 * 0.666)-cnt}秒`;
    if ((Math.round((endTime - startTime) / 1000 * 0.666)-cnt) <=0){
      labelContainer.innerHTML = "完成！！";
      $('#restart').removeClass('hide');
      $('#completed_img').removeClass('hide');
      //タイマーを終了
      clearInterval(interval);
    }
  }

  //ボタンの表示と変数のステータスを最初のスタートを押した状態と同じにする
  $('#restart').on('click', function() {
    $('#restart').addClass('hide');
    //開始瞬間を一回のみにするためのmesurementをfalseにしておく
    baking_status = "not_baked";
    //開始時間と終了時間をリセット
    endTime = 0;
    startTime = performance.now();
    //カウントダウン用の変数をリセット
    cnt = 0;
    $('#canvas').removeClass('hide');
    $('#first_baking_completed_img').addClass('hide');
    $('#completed_img').addClass('hide');
    $('#enyoy').addClass('hide');
  window.requestAnimationFrame(loop);
  });

}
