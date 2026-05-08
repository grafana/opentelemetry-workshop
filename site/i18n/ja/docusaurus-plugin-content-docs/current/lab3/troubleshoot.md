---
sidebar_position: 2
---

# 3.2. ミッション A: トラブルシュート

このミッションでは、私たちの本番環境で自由に調査してもらいます。（本当に！）

Grafana は可観測性企業であるだけでなく、新しいオンラインストアで望遠鏡や宇宙観測グッズの販売も始めました。すべてマイクロサービスで支えられています。

私たちはすべてのサービスに OpenTelemetry 計装を追加しており、より容易に監視できるようにしています。

このアプリケーションは [OpenTelemetry Demo][1] をベースにしています。これは、ほぼ実環境に近い環境で OpenTelemetry の実装を示すことを目的とした、マイクロサービスベースの分散システムです。

![Astronomy Shop homepage](/img/oteldemo_homepage.png)

このラボでのあなたの課題は、OpenTelemetry シグナルを使って問題を見つけ、トラブルシュートすることです。**あるサービスが失敗して問題を引き起こしています。なぜか突き止められますか？**

## ステップ 1: 準備する

すべてのサービスは `production` 環境にあります。

1.  Grafana Cloud インスタンスにアクセスします。

1.  メインメニューから **Application** をクリックして Application Observability を開きます。

1.  **Environment** ドロップダウンで既存の選択をクリアし、**production** を選択します。

1.  これで Astronomy Shop を構成する本番サービスがすべて表示されるはずです。

1.  **Service Map** タブをクリックして、サービストポロジーを 1 画面で確認します。

準備完了です！

## ステップ 2: サービスの何が問題か？

Product Catalog サービスが失敗しているようです。OpenTelemetry シグナルを探索し、原因を突き止めてください。

1.  Grafana Cloud インスタンスのツールを使って、Product Catalog Service が失敗している理由を探してください。

1.  根本原因が分かったら、いつ・なぜ起き始めたかも突き止められますか？OpenTelemetry resource attributes は役立ちますか？


使用できるツール:

| Tool | どのように役立つか |
| ---- | ------------------- |
| Application Observability | - Service Inventory を使ってエラー率の高いサービスをすばやく特定<br/>- サービスをクリックしてメトリクスを詳しく確認<br/>- エラー trace まで掘り下げられるか？<br/>- Logs に有益な情報はあるか？ |
| Explore Logs | - service_name でログを絞り込む<br/>- フィルターでエラーログを探す<br/>- エラーを示すログパターンを見つける |
| Explore | - Loki、Tempo、Prometheus のアドホッククエリを自分で作成 |

さらにヒントが必要なら、下の表示バーをクリックしてください。

<details>
    <summary>さらにヒントを見るにはここをクリック</summary>

    実際のトラブルシューティングでは時間との勝負です。根本原因を素早く見つける必要があります。複雑なマイクロサービス環境では複数サービスが影響を受けているように見えても、1 つの失敗サービスが連鎖的な問題を引き起こしている場合があります。

    - まず frontend サービスを見てみてください。どの下流サービスが影響を受けていますか？

    - product catalog サービスのデータベースを見てみてください。問題はありますか？

    - 問題があると traces にはしばしば `error` ステータスが付きます。`error` ステータスの traces はありますか？

    - エラー発生時刻と同時に変化した OpenTelemetry resource attributes はありますか？

</details>

[1]: https://github.com/grafana/opentelemetry-demo 
