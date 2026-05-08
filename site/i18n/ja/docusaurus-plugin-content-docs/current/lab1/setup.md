---
sidebar_position: 1
---

# 1.1. 環境を初期化する

## ステップ 1: 無料アカウントを作成して Grafana cloud にログインする

grafana labs で登録してください。

1.  アカウント登録のために、この URL [register to grafana](https://grafana.com/auth/sign-up/create-user?pg=login) にアクセスします。

2.  登録方法の選択画面が表示された場合は、認証プロバイダーを使う方法が最も簡単です。
![alt text](/img/grafana_auth.png) 

3. 最初のスタックを作成し、**スタック URL を選択**します。このワークショップではリージョンに Singapore を使用してください。
![alt text](/img/firststack.png) **新しいスタックの作成には時間がかかる場合があります**

4. オンボーディングページでは、**I'm already familiar with Grafana Cloud** を選択して **Skip setup** をクリックできます。

5. **See all data connections** を選択します。

6. **Observability -> Application** に移動します。
![alt text](/img/navigate_o11y_app.png)

7. **Activate Application Observability** を有効にして **Connect data** をクリックします。

8. **OpenTelemetry (OTLP)** を選択し、手順に従います。
    - 計装方法を選択: **OpenTelemetry SDK**
    - 言語を選択: **Other**
    - インフラを選択: **Linux**
    - 計装方法を選択: **Grafana Alloy** 
    - Grafana Cloud アクセストークンを作成: **workshop-otel** 
    - トークンを作成
    - **⚠️ 後続の手順で使用するため、トークンを必ずコピーしてください**
    - Alloy config の下にスクロールして **otel path と user name をコピー**します
    - ![alt text](/img/otelusernamepassword.png)
    
9. この時点で 3 つの情報が揃います。次の手順で Alloy を設定するときに必要なので、⚠️ 必ず保持してください。
    - GRAFANA_CLOUD_OTLP_ENDPOINT = **"The url endpoint"**
    - GRAFANA_CLOUD_OTLP_USERNAME = **"The username"**
    - GRAFANA_CLOUD_OTLP_PASSWORD = **"The token"**

## ステップ 2: GitHub アカウントにログインする

1. GitHub アカウントにログインします。
2. [https://github.com/hendritjipto/opentelemetry-workshop](https://github.com/hendritjipto/opentelemetry-workshop) にアクセスします。
3. **Code** をクリックし、**Codespaces** を選択してこのリポジトリの新しい codespace を起動します。

![alt text](/img/codespace.png)

4. 好みに合わせてテーマを変更します: 右上にある **Command Palette** アイコンをクリックします。
    - 次に **theme** と入力して、一覧から Theme コマンドを探します。
    - その後、好きなテーマを選択します。ライトでもダークでも、お好みでどうぞ！

## ステップ 3: デモアプリを実行する

この最初のラボでは、_Rolldice_ というデモアプリケーションを扱います。

このアプリを試してみましょう。

1.  **Terminal -> New Terminal** から新しいターミナルを起動します。

1.  ターミナルで次のコマンドを実行し、最初のプロジェクトを永続ワークスペースにコピーします。

    ```
    cd ./source/rolldice/
    ```

1.  次に、以下のコマンドでアプリケーションを起動します。

    ```
    ./run.sh
    ```

    アプリケーションが起動します。

1.  2 つ目のターミナルを作成します。分割ターミナルアイコン（"Terminal 1" があるタブバー右端）を使うか、**Terminal -> New Terminal** から作成します。

1.  2 つ目のターミナルで、_curl_ を使って rolldice サービスへサンプルリクエストを送信します。

    ```shell
    curl localhost:8080/rolldice
    ```

    rolldice サービスがランダムな数値を返します。

1.  最初のターミナルのタブに戻り、**Ctrl+C** を押してアプリケーションを停止します。

## まとめ

このラボで使用するデモアプリケーションを実行できました。ただし、現時点ではアプリケーションは比較的孤立しており、まだ観測されていません。

次のラボでは、アプリに OpenTelemetry 計装を追加し、テレメトリーシグナルを Grafana Cloud に送信し始めます。

続けるには、下の次のモジュールをクリックしてください。
