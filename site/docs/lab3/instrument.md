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

1.  Inside the `var()` block, add these lines to declare our counter variables:

    ```
    gamesStartedCounter   metric.Int64Counter
    gamesCompletedCounter metric.Int64Counter
    ```

1.  Then, we will register two new counter metrics with the OpenTelemetry SDK. Add the following code:

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

1.  Now increment the counter **after** we've rolled the dice twice, to get the scores for the player and computer. This line will increment the counter and add an _attribute_ so that we can keep track of who won the game (which is stored in `resultCode`):

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


## Wrapping up

In this mission, you've seen:

- How to add valuable context to your telemetry, using the OpenTelemetry SDK

- How OpenTelemetry custom span attributes are stored and searchable in Tempo and Grafana Cloud Traces.

- How an OpenTelemetry custom metric is searchable within Mimir and Grafana Cloud Metrics.

:::opentelemetry-tip

Once you've begun to instrument your own applications with OpenTelemetry auto instrumentation, why not start to consider what additional context you would find valuable to add to your telemetry data. With OpenTelemetry, you have a rich set of APIs and toolkit at your disposal.

:::

---

**Congratulations, you've completed the whole workshop!**

[1]: https://opentelemetry.io/docs/reference/specification/compatibility/prometheus_and_openmetrics/#resource-attributes-1
