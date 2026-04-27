---
sidebar_position: 3
---

# 3.3. 미션 B: 계측 향상

이 미션에서는 텔레메트리를 한 단계 높은 수준으로 끌어올립니다. 프로덕션 팀은 애플리케이션 동작에 대한 더 깊은 인사이트가 필요하며, OpenTelemetry SDK를 사용하여 필요한 것을 정확하게 제공하는 _커스텀 메트릭_과 _커스텀 스팬 속성_을 만들겠습니다.

몇 줄의 코드가 어떻게 모니터링 기능을 변환할 수 있는지 살펴봅시다.

## 파트 1: 커스텀 메트릭 추가

Lab 2에서 본 오류의 고통 이후, 운영팀은 컴퓨터나 플레이어 또는 어느 쪽도 게임을 이긴 횟수를 모니터링하고 싶어합니다.

### 커스텀 메트릭 정의 및 증가
이 정보를 노출하는 커스텀 OpenTelemetry 메트릭을 추가해 봅시다:

1.  코드 편집기에서 **gameserver.go**를 여세요.

1.  파일 상단의 **imports**를 업데이트하여 다음 opentelemetry 패키지를 추가하세요:

    ```
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/metric"
    ```

1.  `var()` 블록 안에 다음 줄을 추가하여 새 **meter** 객체와 카운터를 보유할 변수를 선언하세요:

    ```
    meter = otel.Meter(schemaName)

    gamesStartedCounter   metric.Int64Counter
    gamesCompletedCounter metric.Int64Counter
    ```

1.  이제 OpenTelemetry SDK에 두 개의 새로운 카운터 메트릭을 등록해 봅시다. **var ()** 블록 다음과 `type gameRequest` 전에 다음 코드를 추가하세요.

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

1.  이제 "games started" 카운터를 증가시켜 봅시다.

    `gameserver()` 함수 안에서 tracer를 초기화한 후(`tracer.Start()`로), 다음 줄을 추가하세요. 이는 "games.started" 카운터를 증가시킵니다 - 즉, 성공적으로 완료되었는지 여부에 관계없이 플레이된 모든 게임의 카운터입니다:

    ```go
    gamesStartedCounter.Add(r.Context(), 1, metric.WithAttributes())
    ```

1.  이제 **getResult** 호출 **후에** 카운터를 증가시키세요. 다음 코드 줄은 카운터를 증가시키고 게임 승자(resultCode에 저장된)를 추적하기 위해 _속성_을 추가합니다:

    ```go
    gamesCompletedCounter.Add(r.Context(), 1, metric.WithAttributes(attribute.String("winner", resultCode)))
    ```

1.  터미널에서 코드를 재포맷하세요:

    ```
    go fmt
    ```

1.  이제 앱을 다시 실행하고 아직 실행 중이지 않다면 k6 부하 테스트도 다시 실행하세요.

    Alloy를 통해 새 OpenTelemetry 메트릭이 생성되고 Grafana Cloud로 전송될 때까지 잠시 기다리세요.

### Grafana에서 커스텀 메트릭 찾기

1.  Grafana에서 **Drilldown -> Metrics**로 이동하세요.

1.  문자열 **game**을 검색하고 **job** = **(네임스페이스)/gameserver**에 대한 필터를 추가하세요.

    ![gameserver metrics in Metrics Drilldown](/img/exploremetrics_games.png)

    :::opentelemetry-tip

    Mimir와 Prometheus는 [Prometheus 및 OpenMetrics와의 OpenTelemetry 호환성 사양][1]에 따라 `job` 및 `instance` 레이블을 사용합니다.

    즉, `job` 레이블을 사용하여 서비스를 찾을 수 있으며, `service.namespace`와 `service.name` 속성을 합쳐 `mynamespace/myservice`와 같은 형태로 표시됩니다.

    :::

1.  **games_completed_total** 메트릭을 클릭한 다음 **winner** 레이블을 클릭하여 컴퓨터 대 플레이어 승리 분류를 확인하세요.

    OpenTelemetry 속성(_winner_)이 Prometheus 레이블로 어떻게 나타나는지 보여주며, 컴퓨터 대 플레이어 승리를 명확하게 볼 수 있습니다. 거의 균형 잡힌 것처럼 보입니다!

    ![gameserver metrics in Metrics Drilldown](/img/exploremetrics_games_winners.png)



## 파트 2: 커스텀 스팬 속성 추가

트레이스 스팬에 속성을 추가할 수도 있습니다. 이는 각 요청에 대한 추가 컨텍스트를 제공하여 문제 해결 상황에서 매우 유용할 수 있습니다.

1.  편집기에서 **gameserver.go** 파일을 여세요.

1.  `gamesCompletedCounter`를 증가시키는 줄 앞에 다음 줄을 삽입하세요:

    ```go
    gameResultAttr := attribute.String("game.result", resultCode)
    span.SetAttributes(gameResultAttr)
    ```

1.  파일을 저장하고 `go fmt`로 코드를 포맷한 다음 `run.sh`를 다시 실행하여 프로그램을 재시작하세요.

1.  테스트 데이터가 생성될 때까지 잠시 기다리세요. 그런 다음 **Grafana Cloud -> Explore**로 이동하여 **Traces** 데이터 소스를 선택하세요.

    다음을 사용하여 트레이스를 검색하세요:

    - 서비스 이름: **gameserver** 

    - 태그: **resource: service.namespace = (네임스페이스)**

    그런 다음 더하기 **+** 버튼을 클릭하여 다른 태그 필터를 추가하세요:

    - span: **game.result = COMPUTER**

1.  트레이스를 클릭하고 **play**라는 스팬을 확장하세요.

    **Span Attributes** 섹션을 확장하세요. `game.result`가 이제 스팬 속성으로 기록되어 COMPUTER를 표시한다는 것에 주목하세요.

    이제 애플리케이션의 특정 비즈니스 시나리오(이 경우 컴퓨터가 게임에서 이긴 트레이스)와 관련된 트레이스를 즉시 찾을 수 있습니다.

1.  질문: `game.result`가 PLAYER도 COMPUTER도 아닌 모든 트레이스를 찾으면 어떤 결과가 반환되나요?


<details>
    <summary>_gameserver.go_의 완성된 코드 보기</summary>

    이 연습을 완료하지 못했지만 "끝으로 건너뛰기"를 원하신다면, **gameserver.go**의 내용을 메트릭 및 트레이스 계측 코드를 포함한 이 소스 파일로 교체할 수 있습니다:

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


## 마무리

이 미션에서 다음을 확인했습니다:

- OpenTelemetry SDK를 사용하여 텔레메트리에 귀중한 컨텍스트를 추가하는 방법

- OpenTelemetry 커스텀 스팬 속성이 Tempo와 Grafana Cloud Traces에서 저장되고 검색 가능한 방법

- Prometheus, Grafana Cloud Metrics 및 Metrics Drilldown을 사용하여 OpenTelemetry 커스텀 메트릭을 검색하는 방법

## 완료했습니다! 다음은 무엇인가요?

OpenTelemetry 자동 계측의 힘을 잠금 해제했으므로, 애플리케이션에 가장 중요한 커스텀 인사이트로 텔레메트리 데이터를 풍부하게 하는 가능성을 상상해보세요.

OpenTelemetry의 풍부한 툴킷과 API는 원시 데이터를 실행 가능한 인텔리전스로 변환하는 더 깊고 의미 있는 관찰 가능성을 만드는 관문입니다.

커스텀 계측 몇 줄만으로 텔레메트리 데이터가 어떤 가치 있는 이야기를 전할 수 있을까요?



[1]: https://opentelemetry.io/docs/reference/specification/compatibility/prometheus_and_openmetrics/#resource-attributes-1
