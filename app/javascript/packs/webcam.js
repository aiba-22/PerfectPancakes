//全体の流れはinit_btnのボタンをクリックした時にカメラの起動が始まり、次に画像解析が始まる
//全て読み込まれてから要素を取り込む
window.onload = function() {
  $(function() {
    $('#video_container').hide(); //iphonでvideoの再生ボタンが表示される事象があったので非表示にしておく
    $('#result_output_container').hide(); //ユーザーに判定結果や操作案内をするコンテナ
    $('#loader').hide(); //ローディングアニメーションは最初は非表示にしておく
  })

    // labelContainer: フロント側に表示する結果を格納する
      let labelContainer, model;
    // 焼き加減の数値を格納
      var favorite_baking = document.getElementById("favorite_baking");
      var favorite_baking = favorite_baking.getAttribute('value');
    //ページを読み込む際にlabelContainerの要素を取得する必要がある為、initの前に記載
      var button =document.getElementById("init_btn")
      button.onclick = function(){
        init();
      }
      async function init() {
        $("#video_container").show();//スタートボタンが押されたらvideoは表示させる
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

    //スタートボタンを待ちのボタンに変更を行
      button.innerHTML = "";
      $('#loader').show(); //ローディングアニメーションを表示

    //使い方を非表示にする
      instructions = document.getElementById("instructions")
      instructions.innerHTML = ""

    //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
      const URL = "https://teachablemachine.withgoogle.com/models/IPWxO1WB8/";

    //teachablemachineのモデルURLを読み込む
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

    //モデルのイメージを格納する
      model = await tmImage.load(modelURL, metadataURL);
    //フロント側に表示する結果ラベルをDOMに要素追加する
      labelContainer = document.getElementById("label-container");
    //進捗インジケータを見えなくする
      $('#loader').hide(); //ローディングアニメーションを表示
      $('#result_output_container').show(); //ユーザーに判定結果や操作案内をするコンテナを表示
    //画像を常に識別し結果を表示するためのループ処理
      window.requestAnimationFrame(loop);
    }


  let baking_status = "not_baked"; //片面の焼きが完了したら反対側の焼きに移行するので、焼き加減の状態を追えるようにを変数を用意する
  let endTime = 0; // 終了時間
  let startTime = 0; // 開始時間
  let cnt = 0;
  let interval;

  async function loop() {
    await predict();
    if (baking_status == "baking_completed"){
      window.cancelAnimationFrame(loop);
      first_baking_completed();
    }else{
      window.requestAnimationFrame(loop);
    }
  }

  //カメラ画像からgoogleのteachablemachineのモデルより近い画像がどれか判定をしていく
  async function predict(){
  //canvasに静止画を格納する
    var canvas =document.getElementById("canvas")
    canvas.getContext("2d").drawImage(video, 0, 0, 200, 200)
    const prediction = await model.predict(canvas);
    //数値によってラベルの結果を変更する
    //#{@user}はuserモデルのfavoriteカラム（焼き加減）の数値が入るようになっている
    switch(true){
      case prediction[0].probability.toFixed(2) >= 0.5:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "まだまだ";
        if (baking_status == "not_baked"){
          startTime = performance.now();
          baking_status = "start_baking";
        }
      break;
      case prediction[1].probability.toFixed(2) >= 0.5:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "今だ";
        if (baking_status =="start_baking"){
          endTime = performance.now(); // 終了時間
          //最初の焼きが完了すると『もう少し』から『今だ』にかかった時間を測定して次のステップに進ませる
          baking_status = "baking_completed"
        }
      break;
      case prediction[1].probability.toFixed(2) * favorite_baking >= 0.3:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "もう少し";
      break;
      case prediction[2].probability.toFixed(2) * favorite_baking >= 0.5:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "PerfectPancakes!!";
        break;
      case prediction[3].probability.toFixed(2) * favorite_baking >= 0.5:
        labelContainer.className = "yureru-s";
        labelContainer.innerHTML = "パンケーキを映してください"
        break;
    }
  }

  //反対側の焼きをスタートする為のボタンと新しいパンケーキを焼き直すボタンは必要な時以外は非表示にしておく
  $(function() {
    $('#baking_time_result').hide();//焼き時間と次の予想時間を表示するテキスト
    $('#second_baking_button').hide();//反対側の焼きをスタートするボタン
    $('#restart').hide(); //新しいパンケーキを作るためにリスタートするボタン
  });

  //次の焼き時間目安を表示させカウントダウンタイマーのボタンを表示させる
  function first_baking_completed(){
    $('#baking_time_result').text(`片面の焼き時間は ${Math.round((endTime - startTime)/1000)}秒でした。次の焼き加減目安は ${Math.round((endTime - startTime) / 1000 * 0.5)}秒です。パンケーキをひっくり返したらスタートを押してください。`);
    $('#baking_time_result').show();
    $('#second_baking_button').show();
  }

  //カウントダウンをスタートさせると1秒ごとにcountupを作動させる
  $('#second_baking_button').on('click', function() {
    $('#baking_time_result').hide();
    $('#second_baking_button').hide();
    interval = setInterval(countup, 1000);
  });
  //タイマーを表示させて0になったら終了する
  function countup(){
    cnt++;
    labelContainer.innerHTML = `2回目のひっくり返しまであと${Math.round((endTime - startTime) / 1000 * 0.5)-cnt}秒`;
    if ((Math.round((endTime - startTime) / 1000 * 0.5)-cnt) <=0){
      labelContainer.innerHTML = "今だ";
      $('#restart').show();
      //タイマーを終了
      clearInterval(interval);
    }
  }

  //ボタンの表示と変数のステータスを最初のスタートを押した状態と同じにする
  $('#restart').on('click', function() {
    $('#restart').hide();
    //開始瞬間を一回のみにするためのmesurementをfalseにしておく
    baking_status = "not_baked";
    //開始時間と終了時間をリセット
    endTime = 0;
    startTime = 0;
    //カウントダウン用の変数をリセット
    cnt = 0;
  window.requestAnimationFrame(loop);
  });

}

