//全体の流れはinit_btnのボタンをクリックした時にカメラの起動が始まり、次に画像解析が始まる
//全て読み込まれてから要素を取り込む
window.onload = function() {
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
      };

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

    //スタートボタンを待ちのボタンに変更を行う

      button.className = "spinner-border";
      button.innerHTML = "";

    //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
      const URL = "https://teachablemachine.withgoogle.com/models/vtT6LMR6V/";

    //teachablemachineのモデルURLを読み込む
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

    //モデルのイメージを格納する
      model = await tmImage.load(modelURL, metadataURL);
      console.log(model);
    //フロント側に表示する結果ラベルをDOMに要素追加する
      labelContainer = document.getElementById("label-container");
    //進捗インジケータを見えなくする
      button.className = "transparent-img";
    //画像を常に識別し結果を表示するためのループ処理
      window.requestAnimationFrame(loop);
    }


    async function loop() {
    //canvasに静止画を格納する
      var canvas =document.getElementById("canvas")
      canvas.getContext("2d").drawImage(video, 0, 0, 200, 200)
      const prediction = await model.predict(canvas);
      //数値によってラベルの結果を変更する
      //#{@user}はuserモデルのfavoriteカラム（焼き加減）の数値が入るようになっている
        if (( prediction[0].probability.toFixed(2) * favorite_baking) >= 0.02) {
          labelContainer.className = "mocchiri ";
          labelContainer.innerHTML = "いまだ！！";
        }

        if (( prediction[0].probability.toFixed(2) * favorite_baking) < 0.02 && (prediction[0].probability.toFixed(2) * favorite_baking) >= 0.01) {
          labelContainer.className = "purupuru2";
          labelContainer.innerHTML = "もうすこし";
        }


        if (( prediction[0].probability.toFixed(2) * favorite_baking) < 0.01 && (prediction[0].probability.toFixed(2) * favorite_baking) >= 0) {
            labelContainer.className = "yureru-s";
          labelContainer.innerHTML = "まだまだ";
        }

      window.requestAnimationFrame(loop);
      }
  }