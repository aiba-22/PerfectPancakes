//~~~全体の流れ~~~
//①init_btnのボタンをクリックした時にリアカメラの起動が始まり
//②次にカメラ像を格納するvideoタグの映像をcanvasに静止画で切り取りteachablemachineを使用して画像の判定をしていく
//③パンケーキの状態をステータスで追っていき、片面の焼きが完了するともう片面の焼き時間を測るタイマーの処理に移る
//④タイマー処理が終わると②に戻る


//全て読み込まれてから要素を取り込む
window.addEventListener = function() {
//~カメラ起動するまでの処理~

    let URL //googleのteachablemachineの学習モデルのURLを格納
    let model //URLで取得されたモデルのイメージを格納
    let video = document.getElementById('video')//カメラ映像を表示

    //スタートボタンは二つ用意し、それぞれでモデルを取得するURL先を変える
    let start_btn =document.getElementById('start_btn')//スタートボタン（通常）
    let thick_size_start_btn =document.getElementById('thick_size_start_btn')//スタートボタン（厚め）

    //通常ボタンのスタートを押した時
    start_btn.onclick = function(){
        //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
        URL = 'https://teachablemachine.withgoogle.com/models/gXEpLx0KS/'//パンケーキの厚みが通常の画像を格納したモデル
        init()
    }
    //厚めのボタンのスタートを押した時
    thick_size_start_btn.onclick = function(){
    //googleのteachablemachineを使用して画像解析をするのでモデル先のURLを格納
        URL = 'https://teachablemachine.withgoogle.com/models/G3RgTX00-/'//パンケーキが厚めの画像を格納したモデル
        init()
    }

    async function init() {

        $('#point_img').addClass('hide')//うまく焼くポイントの画像を非表示にする

        let medias//カメラの設定
        //カメラの設定（音声なし、リアカメラ）をmeidiasに格納
        medias = {
            audio: false,
            video: {
                facingMode: {
                    exact: 'environment'
                }
            }
        }

        //ユーザーのカメラを取得する
        const promise = navigator.mediaDevices.getUserMedia(medias)//カメラへのアクセスを提供するオブジェクトにmediasを渡す
        //カメラの起動許可をするとコールバックしてvideoタグにカメラ映像を写す
        promise.then(successCallback)
            .catch(errorCallback)
        //コールバックより実行しvideoオブジェクトにカメラ映像を格納する
        function successCallback(stream) {
            video.srcObject = stream
        }
        //起動許可がされない時はアラート表示を行う
        function errorCallback(err) {
            alert(err)
        }

        $('#start_btn').addClass('hide')//スタートボタン（通常）を非表示
        $('#thick_size_start_btn').addClass('hide')//スタートボタン（厚め）を非表示
        $('#loader').removeClass('hide') //ローディングアニメーションを表示

        //teachablemachineのモデルURLを読み込む
        const modelURL = URL + 'model.json'
        const metadataURL = URL + 'metadata.json'

        //モデルのイメージを格納する
        model = await tmImage.load(modelURL, metadataURL)

        $('#loader').addClass('hide') //ローディングアニメーションを非表示
        $('#result_output_container').removeClass('hide') //ユーザーに判定結果や操作案内をするコンテナを表示

        //画像判定に進める（requestAnimationFrameで常にループで判定していく）
        window.requestAnimationFrame(loop)
    }

    //~ここから画像判定の処理に進む~

    let judgement_container = document.getElementById('judgement_container') //パンケーキ判定結果を入れる（まだまだ、もう少し、今だを入れる）
    let favorite_baking = document.getElementById('favorite_baking').getAttribute('value')//焼き加減調整の数値を入れる

    //片面の焼きが完了したら反対側の焼きに移行するので、焼き加減の状態を追えるようにを変数を用意する
    let baking_status = 'not_baked'//初期値はnot_baked
    let startTime = 0 // まだまだに判定がなった時の開始時間
    let endTime = 0 // 今だになった時の終了時間
    let elapsedTime //画像判定の処理が始まってからの経過時間


    async function loop() {
        elapsedTime = performance.now()
        if ((Math.round(elapsedTime - startTime) / 1000) < 230){//経過時間230秒までは処理を続ける
            //判定処理に進む
            await predict()
            //パンケーキの状態が今だ(baking_completed)になった時に判定処理を終わらせてタイマー機能に移行する
            if (baking_status == 'baking_completed'){
                window.cancelAnimationFrame(loop)//ループ処理を止める
                first_baking_completed()
            }else{
                //今だの状態にならない限りループ処理を続ける
                window.requestAnimationFrame(loop)
            }
        }else{
            //経過時間が230秒を超えるようなら処理を止める
            window.cancelAnimationFrame(loop)
            timeup()
        }
    }
    //判定を止めてアラートを出す、アラートのOKを押すとページがリロードされる
    async function timeup(){
        if (await swal('長時間経過したため解析を中断しました。焼きすぎの可能性があるのでパンケーキを確認して下さい。')) {
            location.reload()
        }
    }

    //〜カメラの映像をgoogleのteachablemachineのモデルを使用して判定をしていく〜
    async function predict(){
        let canvas =document.getElementById('canvas')//videの映像を静止画にして格納するための変数

        //videoの横縦幅とアスペクト比を取得する（サイズによってcanvasへのトリミングを変えるため）
        let videoWidth = video.videoWidth * 0.8//横幅を取得、少しズームさせたいので0.8をかける
        let videoHeight = video.videoHeight * 0.8//縦幅を取得、少しズームさせたいので0.8をかける
        let videoRate = videoWidth / videoHeight//アスペクト比を取得
        let Starting_X //横の描画スタート位置
        let Starting_Y // 縦の描画スタート位置

        if(videoRate >= 1){ //アスペクト比が1より大きければ縦長画像が横長のとき
            Starting_X = (videoWidth - videoHeight) /2
            canvas.getContext('2d').drawImage(video, Starting_X, 0, Starting_X + videoHeight, videoHeight, 0, 0, 200, 200)
        }else{ //画像が縦長のとき
            Starting_Y = (videoHeight - videoWidth) /2
            canvas.getContext('2d').drawImage(video, 0, Starting_Y, videoWidth, Starting_Y + videoWidth, 0, 0, 200, 200)
        }

        //モデルのメソッドpredictにcanvasを渡すことで、判定値が％で返ってくる
        let prediction = await model.predict(canvas)
        //数値によってjudgement_containerの結果を変更する
        switch(true){
        case prediction[0].probability.toFixed(2) >= 0.5:
            judgement_container.className = 'yureru-s'
            judgement_container.innerHTML = 'まだまだ'
            if (baking_status == 'not_baked'){
                startTime = performance.now()//焼き始めの時間を取得
                baking_status = 'start_baking'//焼きが始まったステータスにする
            }
            break
        case prediction[1].probability.toFixed(2) * favorite_baking >= 0.8://favorite_bakingの数値（0.9~1.1）を掛け合わせる事で今だの判定結果を調整している
            judgement_container.className = 'yureru-s'
            judgement_container.innerHTML = '今だ'
            if (baking_status =='start_baking'){
                endTime = performance.now() // 終了時間
                //最初の焼きが完了すると『もう少し』から『今だ』にかかった時間を測定して次のステップに進ませる
                baking_status = 'baking_completed'//焼きが完了したステータスにする
            }
            break
        case prediction[1].probability.toFixed(2) >= 0.4:
            judgement_container.className = 'yureru-s'
            judgement_container.innerHTML = 'もう少し'
            break
        case prediction[2].probability.toFixed(2) >= 0.7:
            judgement_container.className = 'yureru-s'
            judgement_container.innerHTML = 'PerfectPancakes!!'
            break
        case prediction[3].probability.toFixed(2) >= 0.8:
            judgement_container.className = 'yureru-s'
            judgement_container.innerHTML = 'パンケーキを映してください'
            break
        }
    }

    //〜反対側の焼きをサポートするタイマー機能の処理〜

    //カウントダウンタイマー用への表示変更と、カウントダウンボタンをクリックした後の処理
    function first_baking_completed(){
        $('#baking_time_result').text(`片面の焼き時間は ${Math.round((endTime - startTime)/1000)}秒でした。次の焼き加減目安は ${Math.round((endTime - startTime) / 1000 * 0.666)}秒です。パンケーキをひっくり返したらスタートを押してください。`)
        $('#baking_time_result').removeClass('hide')//焼き時間結果と次の目安を表示
        $('#second_baking_button').removeClass('hide')//カウントダウンをスタートするボタンを表示
        $('canvas').addClass('hide')//カメラ映像を映しているcanvasを非表示
        $('#first_baking_completed_img').removeClass('hide')//代わりにイメージ画像を表示

        $('#second_baking_button').off('click')//jqueryの特性上２回目以降のボタンを押したときにクリック回数が加算されないようにoffにする
        //タイマーの処理を開始する
        $('#second_baking_button').on('click', function() {
            $('#baking_time_result').addClass('hide')//焼き時間結果と次の目安を非表示
            $('#second_baking_button').addClass('hide')//カウントダウンスタートのボタンを非表示

            let cnt = 0 //カウントダウン仕様にするのでタイマーの数字を引くための変数

            //カウントダウン関数を用意
            let countdown = function() {
                cnt++// 1ずつカウント
                let time = setTimeout(countdown, 1000)//1秒ずつ繰り返す
                judgement_container.innerHTML = `2回目のひっくり返しまであと${Math.round((endTime - startTime) / 1000 * 0.666)-cnt}秒`

                if ((Math.round((endTime - startTime) / 1000 * 0.666)-cnt) <=0) {
                    judgement_container.innerHTML = '完成!!'//完成を表示
                    $('#restart').removeClass('hide')//新たに焼く用のボタンを表示
                    $('#first_baking_completed_img').addClass('hide')//タイマーイメージ画像の非表示
                    $('#completed_img').removeClass('hide')//完成のイメージ画像を表示
                    //タイマーを終了
                    clearTimeout(time)//カウントのループを止める
                    cnt = 0//２回目以降に反映されないよう0に戻しておく
                }
            }

            //カウントダウンを作動
            countdown()
        })

        //新たに焼くを押した時の処理
        //ボタンの表示と変数のステータスを最初のスタートを押した状態と同じにする
        $('#restart').on('click', function() {
            $('#restart').addClass('hide')//新たに焼くボタンを非表示
            baking_status = 'not_baked'//パンケーキのステータスを焼く前に戻す
            //開始時間と終了時間をリセット
            startTime = performance.now()//スタートタイムを0にしてしまうと経過時間の制限(230秒)に引っかかってしまうので、現時刻を入れておく
            endTime = 0
            //カウントダウン用の変数をリセット
            $('#canvas').removeClass('hide')//カメラ映像を表示
            $('#completed_img').addClass('hide')//完成イメージの非表示
            window.requestAnimationFrame(loop)//判定処理を開始する
        })
    }
}
