---
sidebar_position: 3
---

# 3.3. ミッション B: 計装を強化する

このミッションでは、テレメトリーを次のレベルへ引き上げます。本番チームはアプリケーション動作へのより深い洞察を必要としており、OpenTelemetry SDK を使って _custom metric_ と _custom span attributes_ を作成し、その要求に応えます。

数行のコードで監視能力がどれほど変わるか、さっそく見ていきましょう。

## パート 1: カスタムメトリクスを追加する

ラボ 2 で見たエラーを受けて、運用チームはゲームの勝者が computer / player / どちらでもない回数を監視したいと考えています。

### カスタムメトリクスを定義してインクリメントする
この情報を公開するため、OpenTelemetry のカスタムメトリクスを追加しましょう。

1.  コードエディタで **gameserver.go** を開きます。

1.  ファイル先頭の **imports** を更新し、次の opentelemetry パッケージを追加します。

    ```
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/metric"
    ```

1.  `var()` ブロック内に、次の行を追加して新しい **meter** オブジェクトとカウンター保持用変数を宣言します。

    ```
    meter = otel.Meter(schemaName)

    gamesStartedCounter   metric.Int64Counter
    gamesCompletedCounter metric.Int64Counter
    ```

1.  次に OpenTelemetry SDK へ 2 つの新しいカウンターメトリクスを登録します。**var ()** ブロックの後、`type gameRequest` の前に次のコードを追加します。

    ```go
    func init() {
        var err error

        gamesStartedCounter, err = meter.Int64Counter(
            "games.started",
            metric.WithDescription("Number of games started"),
            metric.WithUnit("{call}"),
        )
        if err != nil {
            panic(err)
        }

        gamesCompletedCounter, err = meter.Int64Counter(
            "games.completed",
            metric.WithDescription("Number of games completed"),
            metric.WithUnit("{call}"),
        )
        if err != nil {
            panic(err)
        }
    }
    ```

1.  次に "games started" カウンターを増加させます。

    `gameserver()` 関数内でトレーサー初期化（`tracer.Start()`）の後に次の行を追加します。これで "games.started" カウンター、つまり成功可否に関係なくプレイされた全ゲーム数のカウンターが増加します。

    ```go
    gamesStartedCounter.Add(r.Context(), 1, metric.WithAttributes())
    ```

1.  さらに **getResult** 呼び出し**後**にもカウンターを増加させます。次のコードはカウンターを増加し、ゲーム勝者（`resultCode`）を追跡するための _attribute_ を追加します。

    ```go
    gamesCompletedCounter.Add(r.Context(), 1, metric.WithAttributes(attribute.String("winner", resultCode)))
    ```

1.  ターミナルでコードを整形します。

    ```
    go fmt
    ```

1.  アプリを再実行し、k6 ロードテストが停止している場合は再実行します。

    新しい OpenTelemetry メトリクスが生成され、Alloy 経由で Grafana Cloud に送信されるまで少し待ちます。

### Grafana でカスタムメトリクスを見つける

1.  Grafana で **Drilldown -> Metrics** に移動します。

1.  **game** で検索し、**job** = **(your namespace)/gameserver** フィルターを追加します。

    ![gameserver metrics in Metrics Drilldown](/img/exploremetrics_games.png)

    :::opentelemetry-tip

    Mimir と Prometheus は、[OpenTelemetry compatibility specification with Prometheus and OpenMetrics][1] に従って `job` と `instance` ラベルを使用します。

    これは `service.namespace` と `service.name` 属性を結合した `job` ラベル（例: `mynamespace/myservice`）でサービスを見つけられることを意味します。

    :::

1.  **games_completed_total** メトリクスをクリックし、次に **winner** ラベルをクリックして、computer と player の勝利内訳を確認します。

    OpenTelemetry 属性（_winner_）が Prometheus ラベルとして表示され、computer と player の勝利を明確に把握できます。ほぼ互角に見えますね！

    ![gameserver metrics in Metrics Drilldown](/img/exploremetrics_games_winners.png)



## パート 2: カスタム span attribute を追加する

trace span に attribute を追加することもできます。これにより各リクエストの文脈が増え、トラブルシューティング時に非常に有効です。

1.  Editor で **gameserver.go** を開きます。

1.  `gamesCompletedCounter` をインクリメントする行の前に、次の行を挿入します。

    ```go
    gameResultAttr := attribute.String("game.result", resultCode)
    span.SetAttributes(gameResultAttr)
    ```

1.  ファイルを保存し、`go fmt` で整形して、`run.sh` を再実行してプログラムを再起動します。

1.  テストデータ生成のため少し待ってから、**Grafana Cloud -> Explore** に移動し、**Traces** データソースを選びます。

    Trace を検索します。

    - Service name: **gameserver**

    - Tags: **resource: service.namespace = (your namespace)**

    次に、プラス **+** ボタンをクリックしてタグフィルターを追加します。

    - span: **game.result = COMPUTER**

1.  Trace をクリックし、**play** という span を展開します。

    **Span Attributes** セクションを展開してください。`game.result` が Span Attribute として記録され、COMPUTER と表示されることが分かります。

    これで、アプリ内の特定ビジネスシナリオに関する trace を即座に見つけられます。今回で言えば、computer が勝ったゲームの trace です。

1.  Q: `game.result` が PLAYER でも COMPUTER でもない trace を検索すると、どのような結果が返りますか？


<details>
    <summary>完成済み _gameserver.go_ コードを見る</summary>

    この演習を完了できなかったが「最後までスキップ」したい場合は、**gameserver.go** の内容を以下のソースに置き換えてください。metrics と traces の計装コードが含まれています。

```go
// gameserver.go - completed source file
package main

import (
"context"
"encoding/json"
"errors"
"fmt"
"io"
"log/slog"
"net/http"
"net/url"
"strconv"
"strings"

"go.opentelemetry.io/contrib/bridges/otelslog"
"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
"go.opentelemetry.io/otel"
"go.opentelemetry.io/otel/codes"

"go.opentelemetry.io/otel/attribute"
"go.opentelemetry.io/otel/metric"
)

var (
tracer = otel.Tracer(schemaName)
logger = otelslog.NewLogger(schemaName)
meter  = otel.Meter(schemaName)

gamesStartedCounter   metric.Int64Counter
gamesCompletedCounter metric.Int64Counter
)

func init() {
var err error

gamesStartedCounter, err = meter.Int64Counter(
"games.started",
metric.WithDescription("Number of games started"),
metric.WithUnit("{call}"),
)
if err != nil {
panic(err)
}

gamesCompletedCounter, err = meter.Int64Counter(
"games.completed",
metric.WithDescription("Number of games completed"),
metric.WithUnit("{call}"),
)
if err != nil {
panic(err)
}
}

type gameRequest struct {
Name string `json:"name"`
}

type gameResponse struct {
PlayerName   string `json:"playerName"`
PlayerRoll   int    `json:"playerRoll"`
ComputerRoll int    `json:"computerRoll"`
Result       string `json:"result"`
}

func gameserver(w http.ResponseWriter, r *http.Request) {
ctx, span := tracer.Start(r.Context(), "play") // Begin a new child span called 'play'
gamesStartedCounter.Add(r.Context(), 1, metric.WithAttributes())
defer span.End()

var req gameRequest
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
logger.ErrorContext(ctx, "ERROR: Invalid request body: %v\n", err)
http.Error(w, "Invalid request body", http.StatusBadRequest)
return
}

msg := fmt.Sprintf("Player %s is playing", req.Name)
logger.InfoContext(ctx, msg, slog.String("player.name", req.Name))

playerRoll, err := rollDice(ctx, req.Name)
if err != nil {
logger.ErrorContext(ctx, "ERROR: Error while rolling dice: %v\n", err)
span.SetStatus(codes.Error, "Rolling player dice failed")
span.RecordError(err)
http.Error(w, "Error rolling dice", http.StatusInternalServerError)
return
}

computerRoll, err := rollDice(ctx, "Computer")
if err != nil {
logger.ErrorContext(ctx, "ERROR: Error while rolling dice: %v\n", err)
span.SetStatus(codes.Error, "Rolling computer dice failed")
span.RecordError(err)
http.Error(w, "Error rolling dice", http.StatusInternalServerError)
return
}

resultCode, resultString, err := getResult(playerRoll, computerRoll)
gameResultAttr := attribute.String("game.result", resultCode)
span.SetAttributes(gameResultAttr)
gamesCompletedCounter.Add(r.Context(), 1, metric.WithAttributes(attribute.String("winner", resultCode)))
msg2 := fmt.Sprintf("Game result was %s", resultCode)
logger.InfoContext(ctx, msg2)

if err != nil {
logger.ErrorContext(ctx, "ERROR: Error while calculating result")
span.SetStatus(codes.Error, "getResult failed")
span.RecordError(err)
http.Error(w, "Error while calculating result", http.StatusInternalServerError)
return
}

resp := gameResponse{
PlayerName:   req.Name,
PlayerRoll:   playerRoll,
ComputerRoll: computerRoll,
Result:       resultString,
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(resp)
}

func rollDice(ctx context.Context, name string) (int, error) {
baseURL := "http://localhost:8080/rolldice"
params := url.Values{}
params.Add("player", name)

url := fmt.Sprintf("%s?%s", baseURL, params.Encode())

// Create a new client and wrap it with a span, injecting the span context into the outbound headers
client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}
req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)

resp, err := client.Do(req)
if err != nil {
return 0, err
}
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
if err != nil {
return 0, err
}

roll, err := strconv.Atoi(strings.TrimSpace(string(body)))
if err != nil || roll < 1 || roll > 6 {
return 0, fmt.Errorf("invalid dice roll: %s", body)
}

return roll, nil
}

func getResult(playerRoll, computerRoll int) (string, string, error) {
switch {
case playerRoll > computerRoll:
return "PLAYER", "You win!", nil
case playerRoll < computerRoll:
return "COMPUTER", "Computer wins!", nil
default:
return "", "", errors.New("No winner - unexpected tie between players!!")
}
}
```
</details>


## まとめ

このミッションでは、次を確認しました。

- OpenTelemetry SDK を使って、テレメトリーに価値ある文脈を追加する方法

- OpenTelemetry の custom span attributes が Tempo と Grafana Cloud Traces に保存され、検索可能になる仕組み

- Prometheus、Grafana Cloud Metrics、Metrics Drilldown を使って OpenTelemetry custom metric を検索する方法

## 完了です！次は？

OpenTelemetry の自動計装の力を使えるようになった今、アプリケーションにとって重要な独自インサイトでテレメトリーデータを拡張する可能性を想像してみてください。

OpenTelemetry の豊富なツールキットと API は、より深く意味のある可観測性を作る入口です。生データを実行可能なインテリジェンスへ変換できます。

数行のカスタム計装で、あなたのテレメトリーデータはどんな価値あるストーリーを語れるでしょうか？



[1]: https://opentelemetry.io/docs/reference/specification/compatibility/prometheus_and_openmetrics/#resource-attributes-1
