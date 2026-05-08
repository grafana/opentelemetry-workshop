---
sidebar_position: 3
---

# 1.2. Collector を設定する

このモジュールでは、アプリケーションから OpenTelemetry シグナルを受信し、Grafana Cloud に送信するための collector を設定します。

## ステップ 1: Grafana Alloy を設定する

Grafana Alloy は OpenTelemetry Collector のディストリビューションで、Terraform のような構文で強力なテレメトリーパイプラインを構築できます。ここでは Alloy を使って OpenTelemetry シグナルを収集し、Grafana Cloud に送信します。

:::opentelemetry-tip[OpenTelemetry collector とは？]

OpenTelemetry Collector は、アプリケーションとテレメトリーバックエンドの間をつなぐブリッジとして機能します。Collector は複数のソースからシグナルを受信し、複数の宛先に送信できます。これにより、可観測性スタックの中で非常に強力かつ柔軟なコンポーネントになります。

:::

このワークショップでは、Alloy を使ってテレメトリーを Grafana Cloud に送信します。データフローは以下のとおりです。

- アプリケーションから OTLP シグナルを受信する
- Grafana Cloud に送信する

次の手順に従ってください。

1.  ターミナルで次を入力します。

    ```bash
    cd ./source/alloy
    ```

1.  Explorer ペインで `./source/alloy/config.alloy` を見つけて開きます。設定ファイルの内容を確認し、次の点に注目してください。

    - `otelcol.receiver.otlp` ブロックがあり、アプリケーションから OTLP シグナルを受信します。
    - `otelcol.exporter.otlphttp` ブロックがあり、シグナルを Grafana Cloud の OTLP エンドポイントへ送信します。

    このファイルで何か作業する必要はありませんが、Alloy の設定ファイルがどのようなものかを知っておくと役立ちます。

    :::tip

    独自環境で OpenTelemetry を実装し始めるときは、Grafana Cloud のインターフェースを使って Alloy の設定ファイルを生成できます。**Connections** に移動して手順に従ってください。

    :::

1.  Explorer ペインで新しいファイル `./source/alloy/run.sh` を見つけて開きます。

    このスクリプトは Grafana Alloy を実行します。まずいくつかの環境変数を設定する必要があることがわかります。

    ```bash
    export GRAFANA_CLOUD_OTLP_ENDPOINT=""
    export GRAFANA_CLOUD_OTLP_USERNAME=""
    export GRAFANA_CLOUD_OTLP_PASSWORD=""
    ```
4. **⚠️ 👆🏻 ここには前の手順で取得した値を入力してください**

## ステップ 2: Grafana Alloy を実行する

これで Grafana Alloy を実行する準備が整いました！

1.  ターミナルで次のコマンドを実行して Grafana Alloy を起動します。

    ```bash
    ./run.sh
    ```

    Alloy が起動し、コンソールにログが出力され始めるはずです。

    ログには "Starting GRPC server" と "Starting HTTP server" のような 2 行が表示されます。これは Alloy が OTLP データ受信用に 2 つのポートを開いたことを意味します。これで Alloy の準備は完了です。

おめでとうございます！collector を実行して、OpenTelemetry シグナルの収集とエクスポートへの第一歩を踏み出しました。

:::opentelemetry-tip

このワークショップではシンプルさを保つため、開発環境内で Grafana Alloy を単体のフォアグラウンドインスタンスとして実行しています。

ただし本番環境では、Alloy を別のトポロジーで実行する場合があります。たとえば Kubernetes を使っている場合、Grafana の Kubernetes Monitoring Helm チャートを使って Alloy をデプロイし、クラスター内のすべての Pod から OTel シグナルを収集できます。

詳細は [the Alloy documentation](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/collector/grafana-alloy-kubernetes/) を参照してください。

:::

## まとめ

このモジュールでは、アプリケーションから OpenTelemetry シグナルを受信し、Grafana Cloud に送信する collector を設定しました。

また、Grafana Alloy の設定方法と、開発環境での実行方法も学びました。

次のモジュールでは、アプリケーションを計装して OpenTelemetry シグナルを Grafana Alloy に送信する方法を学びます。
