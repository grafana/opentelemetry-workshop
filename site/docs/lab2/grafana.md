---
sidebar_position: 1
---

# 2.1. Explore OpenTelemetry in Grafana Cloud

Now let's begin to explore your OpenTelemetry signals in Grafana Cloud.

Remember from the last lab module, your architecture now looks like this:

```mermaid
flowchart LR
    classDef app fill:#f9d71c,stroke:#ccc,stroke-width:2px
    classDef agent fill:#FF6347,stroke:#ccc,stroke-width:2px
    classDef alloy fill:#FFFFFF,stroke:#ccc,stroke-width:2px
    classDef output fill:#87CEEB,stroke:#ccc,stroke-width:2px
    classDef gc fill:#FFFFFF,stroke:#ccc,stroke-width:2px

    A["<div style="padding: 1.5rem"><i class='fa fa-dice fa-lg'></i><br/>Rolldice app</div>"]:::app
    O["<div><i class='fa fa-bolt fa-lg'></i><br/>OTel Java Agent</div>"]:::agent
    LL["<div><i class='fa fa-bolt fa-lg'></i><br/>Grafana Alloy</div>"]:::alloy
    E["<div><i class='fa fa-cloud fa-lg'></i><br/>Grafana Cloud</div>"]:::gc

    A --> O
    O -->|Metrics, Logs, Traces<br/>OTLP| LL
    LL -->|OTLP| E

    style A fill:#f9d71c,stroke:#333,stroke-width:4px
    style O fill:#FF6347,stroke:#333,stroke-width:4px
    style E fill:#32CD32,stroke:#333,stroke-width:4px

    subgraph Java Runtime
        A
        O
    end

```

Now that your application is sending OpenTelemetry signals to Grafana Cloud via Alloy, you can start to see the signals inside your Grafana instance.

## Step 1: Explore Application Observability

**Grafana Cloud Application Observability** is an out-of-the box solution to monitor applications and minimize MTTR (mean time to resolution). Application Observability natively supports both OpenTelemetry and Prometheus and allows you to bring together application telemetry with data from the frontend and infrastructure layers in Grafana Cloud.

Application Observability gives you an opinionated view of the OpenTelemetry-instrumented applications in your environment.

1.  Go to your Grafana instance.

1.  In the side menu, click on **Application** to open _Application Observability_.

    :::tip

    If you prefer to use the keyboard, you can press Ctrl+K (or Cmd+K on a Mac) to open the search bar, and type "Application", then hit **Enter**.

    :::

    Application Observability opens with the service inventory. This view shows all of the services currently sending OpenTelemetry traces, or trace-based metrics, to Grafana Cloud.

1.  In the **Environment** dropdown, clear any existing entries (using the **X** button) and choose **lab** from the list.

    This will show the list of OpenTelemetry instrumented services which are reporting to be running in the `lab` environment.

1.  Press **+ Filter** to add a filter. Choose **service.namespace** for the attribute name, and in the "value" dropdown, choose your namespace from the list.

    :::tip

    If you don't see your namespace in the service inventory, wait a few minutes. Applications appear in the service inventory once span metric generation has begun.

    :::

    :::opentelemetry-tip[A quick word on semantic conventions]

    OpenTelemetry is at its most powerful when you follow its conventions.
    
    We're using the power of OpenTelemetry's _semantic conventions_ here, which is a list of well-known and standardized attributes that can be applied to your telemetry signals. Attributes allow us to slice and dice our telemetry, so that we can view metrics, logs and traces from only the specific service instances that we're interested in.

    The attribute `service.namespace` is part of OpenTelemetry's semantic conventions. We can use it to store a namespace or grouping for our service. So it makes a pretty good choice for a filter here, to identify your applications from those of your fellow lab attendees.

    We've also used the attribute `deployment.environment`, which is used by Grafana Cloud Application Observability to populate its _Environment_ drop-down list.

    You'll become more familiar with OpenTelemetry resource attributes as you use them.

    :::

1.  Now the service inventory will show just your **rolldice** service. Notice how we can instantly see high-level metrics about the service:

    - Duration (P95)
    - Error Rate
    - Request Rate

    Notice how Application Observability also shows the Java coffee-cup logo. This is because the OpenTelemetry instrumentation stores the runtime information in the attribute `telemetry.sdk.language`.

1.  Click on the `rolldice` service to open the Service View.

    Notice how the Service View title is `<namespace name>/<service name>` to show you exactly which namespace we're looking at.

    Application Observability instantly shows us the top line stats that we would typically want to know about our service:

    ![Grafana Alloy shipping OTLP directly to Grafana Cloud](/img/appo11y_rolldice.png)

    In this view you can see the most important health metrics from your application.

    - Duration of requests - mean, 95th and 99th percentiles.

    - Error rate

    - Request rate

    :::info[Using Application Observability with metrics from other sources]

    For most of the visualizations in the application, Application Observability shows metrics generated from traces (so-called _span metrics_). By default, Application Observability generates these metrics for you.
    
    If you prefer, you can use OpenTelemetry's [Span Metrics Connector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/spanmetricsconnector) instead, to generate the metrics locally, and send them to Grafana Cloud.
    
    For more information, [see the Application Observability docs](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/manual/configure).
    :::

1.  Scroll down the page, and you will find the list of operations that are being invoked on this service, along with their typical (P95) duration, error and request rates:

    ![Operations in Application Observability](/img/appo11y_operations.png)


## Step 2: Explore Traces, Logs and Metrics

Traces are one of the building blocks of OpenTelemetry. Traces allow us to observe our system from the inside out.

OpenTelemetry's instrumentation libraries generate traces from our application, which we can explore in Application Observability.

### Traces

1.  From the _rolldice_ service overview, click on the **Traces** tab.

1.  In the traces list, click on a **Trace ID** to open the trace view, side-by-side.

    :::tip

    To make more room for the trace tail, you can resize the view by clicking on the vertical separator bar in the middle and dragging it to the left.

    :::

1.  In the trace view on the right hand side of the screen, under the heading "Service & Operation", click on the **rolldice** span, then expand:

    - Span Attributes
    
    - Resource Attributes

    Here we can see the rich set of attributes which have been automatically captured by the OpenTelemetry agent.

    ![Viewing OpenTelemetry trace span attributes in Application Observability](/img/appo11y_spanattributes.png)

    :::opentelemetry-tip[Understanding _span_ and _resource_ attributes]

    Attributes are pieces of metadata that are attached to signals:

    - **Span Attributes** apply to Trace Spans, and contain metadata relating to this part of the trace. In this example, we only have one span, which captures the HTTP interaction of our app. We can see attributes like `http.route` and `url.query` which help observe the detail of this specific request.

    - **Resource Attributes** contain metadata about our service, and the environment where it is running. We can discover attributes like `telemetry.sdk.language` (Java), `host.name`, and so on.

    :::

1.  Attributes are a powerful part of OpenTelemetry and make it easier to answer questions about our services.

    By looking at the _span attributes_, can you answer the following questions?

    - The _rolldice_ service accepts a player name in the URL's query string. A query string is the part of a URL after the question-mark, like this: `/myservice?param=value`.
    
        From the span attributes, can you find the player name?

        <details>
        <summary>See the answer</summary>

        Look at the **span attribute** `url.query`. It should show a value like `player=John`.
        </details>

    - What is the architecture of the node where the service is running?
    
      <details>
        <summary>See the answer</summary>
  
        Look at the **resource attribute** `host.arch`.
        
        It should show `amd64`, which shows that this service is running on a 64-bit, x86 host.
      </details>

    - Which browser (User-Agent) made the request to the service?

      <details>
        <summary>See the answer</summary>
  
        Look at the **span attribute** `user_agent.original`. 
        
        It should contain something like `k6/0.53.0 (https://k6.io/)`, which is because _k6_ is generating test   requests to our service!
      </details>

### Logs

1.  Click on the **Logs** tab. 

1.  On the right-hand side, ensure the **New Format** button is selected.

    ![Viewing OpenTelemetry logs in Application Observability](/img/appo11y_logs.png)

    Application Observability writes and executes a Loki LogQL query, to find logs for this service, narrowed down to our namespace.
    
    Application Observability also automatically parses and formats additional context which was sent by the OpenTelemetry instrumentation, such as the **scope name** (which, in Java, holds the name of the class), the log level and the trace ID.

    <details>
      <summary>How does Grafana Cloud process your OpenTelemetry logs?</summary>

      Grafana Cloud performs some mapping on your OpenTelemetry logs:
  
      - It determines a `service_name`, and uses it as a _Loki label_.
      - It stores some other OpenTelemetry attributes as labels, like:
          - deployment.environment (becomes `deployment_environment`)
          - service.instance.id (becomes `service_instance_id`)
      - It stores additional OpenTelemetry attributes as _Structured Metadata_, which are key-value pairs that are attached to log lines.
  
      For more information, see [the Loki documentation](https://grafana.com/docs/loki/latest/send-data/otel/).
    </details>

1.  Expand an individual log line by clicking on it. 

    Grafana Cloud captures the rich value of OpenTelemetry _resource attributes_ such as `host.name`, and `deployment.environment`, by attaching them to each log line, replacing periods with underscores.
    
    This provides invaluable context when troubleshooting a problem:

    ![OpenTelemetry attributes in logs in Application Observability](/img/appo11y_logfields.png)

1.  We can also correlate from logs immediately to traces.

    Scroll down a little further, then, next to _traceID_, click on the **View trace** button.

    ![Correlate from a log to a trace](/img/appo11y_traceid.png)

    Then, you will be taken to the Traces tab to view that specific trace, where you can view more information about this request.

### Runtime metrics and information

In addition to traces and logs, OpenTelemetry auto-instrumentation also captures some helpful runtime metrics for our applications, right out of the box.

These metrics can be really helpful for monitoring trends, or identifying issues which may not immediately be obvious from traces or logs.

1.  From Application Observability for the _rolldice_ service, click on the **JVM** tab.

    This tab in Application Observability changes dynamically, depending on the language of the instrumented service. In this case, it shows some metrics which are typical for a Java application:

    - CPU Utilization

    - Heap memory utilization

    and more.

    ![View JVM metrics in Application Observability](/img/appo11y_jvm.png)

1.  Finally, at the top right of the screen, click on the **Runtime** dropdown near the service name.

    You'll see information about the runtime (Java) which has been captured by OpenTelemetry: namely the language.



## Wrapping up

In this lab, you've learned how to do the following:

- Explore OpenTelemetry-instrumented Services in Application Observability

- Use resource attributes to narrow down and view signals for a specific service

- View and correlate between traces and logs 

- View runtime metrics from an application

Click on the next module to continue.







