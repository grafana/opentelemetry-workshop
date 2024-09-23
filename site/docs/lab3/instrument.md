---
sidebar_position: 3
---

# 3.1. Mission B: Enhance instrumentation

For this mission, you've been asked to add some additional contextual information to the telemetry, to help the production team monitor and support the application.

So in this part of the lab, we will use the OpenTelemetry SDK to register our own custom metric.

## Part 1: Add a custom metric

After the pain of the errors we saw in Lab 2, the operations team want to be able to monitor how many times a game is won by either the computer or the player, or neither!

Let's add a custom OpenTelemetry metric to expose this information:

1.  Open **gameserver.go** in the code editor.

1.  Update the **imports** at the top of the file, to add these opentelemetry packages:

    ```
    "go.opentelemetry.io/contrib/bridges/otelslog"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/codes"
    "go.opentelemetry.io/otel/metric"
    ```

1.  Inside the `var()` block, add these lines to declare a new **meter** object and variables to hold our counters:

    ```
    meter = otel.Meter(schemaName)

    gamesStartedCounter   metric.Int64Counter
    gamesCompletedCounter metric.Int64Counter
    ```

1.  Then, we will register two new counter metrics with the OpenTelemetry SDK. Add the following code after the **var** block:

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

1.  Inside the `gameserver()` function, after we've initialized the tracer (with `tracer.Start()`), add the following line. This will increment our "games.started" counter -- in other words, a counter of all games played, whether they completed successfully or not:

    ```go
    gamesStartedCounter.Add(r.Context(), 1, metric.WithAttributes())
    ```

1.  Now increment the counter **after** the call to **getResult**. The following line of code will increment the counter and add an _attribute_ so that we can keep track of who won the game (which is stored in `resultCode`):

    ```go
    gamesCompletedCounter.Add(r.Context(), 1, metric.WithAttributes(attribute.String("winner", resultCode)))
    ```

1.  Re-run your app and re-run the k6 load test, if it isn't running.

    Wait a few moments for the new OpenTelemetry metrics to be generated and pushed to Grafana Cloud via Alloy.

1.  In Grafana, go to **Explore -> Metrics**. Click **New metric exploration**.

1.  Search for the string **game** and add a filter for **job** = **(your namespace)/gameserver**.

    ![gameserver metrics in Explore Metrics](/img/exploremetrics_games.png)

    :::opentelemetry-tip

    Mimir and Prometheus use the `job` and `instance` labels, according the [OpenTelemetry compatibility specification with Prometheus and OpenMetrics][1].

    This means that you can find your service using the `job` label, which joins the `service.namespace` and `service.name` attributes together, e.g. `mynamespace/myservice`.

    :::

1.  Click onto the **games_completed_total** metric and then click the **winner** label to break down the metrics by winner.

    Now we can see how our OpenTelemetry attribute has been transformed into a label in our Prometheus style metric, and we can see an instant breakdown of games won by the computer, compared to those won by the player.

    ![gameserver metrics in Explore Metrics](/img/exploremetrics_games_winners.png)



## Part 2: Add an attribute to a Trace

We can also add an attribute to a Trace. This will help to give us further context about each request, and can be hugely useful.

1.  Open the **gameserver.go** file in your Editor.

1.  Before the line that increments `gamesCompletedCounter`, insert the following lines:

    ```go
    gameResultAttr := attribute.String("game.result", resultCode)
    span.SetAttributes(gameResultAttr)
    ```

1.  Save the file and restart the program by re-running (`run.sh`).

1.  Wait a few moments for test data to be generated. Then, go to **Grafana Cloud -> Explore** and select your **Traces** data source.

    Search for Traces:

    - Service name: **gameserver** 

    - Tags: resource: service.namespace = (your namespace)

    Then, add another tag filter:

    - span: game.result = COMPUTER

1.  Click on a Trace and then expand the span named **play**.

    Expand the **Span Attributes** section. Notice how `game.result` is now recorded as a Span Attribute and it displays COMPUTER. 

    Now we can instantly find traces relating to specific business scenarios in our application - in this case, finding traces where the computer won the game.

1.  Q: What happens if you find all traces where `game.result` is neither PLAYER, nor COMPUTER? What results are returned?


<details>
    <summary>See the completed code for _gameserver.go_</summary>

    If you haven't managed to complete this exercise, but you'd like to "skip to the end", then you can replace your contents of **gameserver.go** with this source file, which includes the metrics and traces instrumentation code:

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
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/metric"
)

var (
	tracer = otel.Tracer(schemaName)
	logger = otelslog.NewLogger(schemaName)
	meter  = otel.Meter(schemaName)

	gamesStartedCounter   metric.Int64Counter
	gamesCompletedCounter metric.Int64Counter
)

type gameRequest struct {
	Name string `json:"name"`
}

type gameResponse struct {
	PlayerName   string `json:"playerName"`
	PlayerRoll   int    `json:"playerRoll"`
	ComputerRoll int    `json:"computerRoll"`
	Result       string `json:"result"`
}

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

func gameserver(w http.ResponseWriter, r *http.Request) {
	ctx, span := tracer.Start(r.Context(), "play") // Begin a new child span called 'play'
	defer span.End()

	gamesStartedCounter.Add(r.Context(), 1, metric.WithAttributes())

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
	msg2 := fmt.Sprintf("Game result was %s", resultCode)
	logger.InfoContext(ctx, msg2)

	gameResultAttr := attribute.String("game.result", resultCode)
	span.SetAttributes(gameResultAttr)
	gamesCompletedCounter.Add(r.Context(), 1, metric.WithAttributes(attribute.String("winner", resultCode)))

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


## Wrapping up

In this mission, you've seen:

- How to add valuable context to your telemetry, using the OpenTelemetry SDK

- How OpenTelemetry custom span attributes are stored and searchable in Tempo and Grafana Cloud Traces.

- How to search for an OpenTelemetry custom metric using Mimir, Grafana Cloud Metrics and Grafana Explore Metrics.

:::opentelemetry-tip

Once you've begun to instrument your own applications with OpenTelemetry auto instrumentation, why not start to consider what additional context you would find valuable to add to your telemetry data. With OpenTelemetry, you have a rich set of APIs and toolkit at your disposal.

:::

---

**Congratulations, you've completed the whole workshop!**

[1]: https://opentelemetry.io/docs/reference/specification/compatibility/prometheus_and_openmetrics/#resource-attributes-1
