---
sidebar_position: 2
---

import OtelSemconv from '@site/src/components/OtelSemconv';

# 3.2. Mission A: Investigate a fully instrumented system

In this mission, you'll investigate a fully instrumented microservices application, in Grafana Cloud.

This is the [OpenTelemetry Demo][1] - a production-grade system where services are exporting OpenTelemetry traces, metrics and logs. 

Your goal in this mission is to use Grafana Cloud to understand the system, identity patterns, and see how OpenTelemetry's _semantic conventions_ are incredibly useful when operating at scale, across many languages and frameworks.   

![Astronomy Shop homepage](/img/oteldemo_homepage.png)

## Step 1: Get ready

Log on to the environment to get started:

1.  Go to the **Reference Grafana URL** that you have been given (Hint: the URL looks like `https://abcd12appenv.grafana.net`).

1.  If you are presented with a choice of sign-in options, click **Sign in with SSO**.

1.  At the _Authentication_ login screen, enter the **username** (not email) and **password** that you received by email, or from your instructor.

## Step 2: Discover your services

In this step, you'll use OpenTelemetry resource attributes to understand what services are running, where they're deployed, and how they're configured.

### Explore workloads and infrastructure

OpenTelemetry can tell us a lot about workloads, and their underlying infrastructure. Explore this environment and see if you can answer these questions:

- **How many services are running?** (Hint: use the Entity Catalog)

- **Which version of each service is running?** (Hint: find a trace use the <OtelSemconv>service.version</OtelSemconv> attribute, or use the Entity Catalog and add Service Version as a column)

- **In which cloud provider and region are these services deployed?** (Hint: search for traces and look in the *resource attributes*, or find the information in Entity Catalog)

- **What is the name of the Kubernetes node which the _checkoutservice_ is running on?** (Hint: this service is called from other services, so if you are searching Drilldown Traces, don't forget to change the filter to "All spans", not "Root spans")

**Why it's important:** Resource attributes give you a complete inventory of your infrastructure - what's running, where it's running, and how it's configured. This forms the foundation for service discovery and helps you understand the topology of your distributed system.

## Step 3: Explore semantic conventions

Now that you know what services exist, let's explore how OpenTelemetry standardizes the way telemetry is captured and exported.

Semantic conventions are agreed-upon naming standards for attributes, spans, and metrics. They make telemetry portable and queryable across any service, regardless of language or framework.

1.  Navigate to **Drilldown -> Traces**.

2.  Find traces for the **ditl-demo-frontend-client** service.

3.  Open an example trace and examine the span attributes:

    - **HTTP spans:** Look for <OtelSemconv type="span">http.request.method</OtelSemconv>, <OtelSemconv type="span">http.route</OtelSemconv>, <OtelSemconv type="span">http.response.status_code</OtelSemconv>
    - **RPC spans:** Find <OtelSemconv type="span">rpc.system.name</OtelSemconv>, <OtelSemconv type="span">rpc.method</OtelSemconv>
    - **Database spans:** Check for <OtelSemconv type="span">db.system.name</OtelSemconv>, <OtelSemconv type="span">db.query.text</OtelSemconv>, <OtelSemconv type="span">db.client.connection.pool.name</OtelSemconv>

4.  Compare a couple of services. Notice how OpenTelemetry auto-instrumentation uses consistent attribute, span and metric naming, irrespective of the language or framework.

5.  Navigate to **Drilldown -> Metrics**.

6.  Answer the question: **Which services use gRPC, and which use HTTP?**
    - Hint: OpenTelemetry conventions define some standard metric names, like <OtelSemconv type="metric">http.server.request.duration</OtelSemconv> and <OtelSemconv type="metric">rpc.server.call.duration</OtelSemconv>
    - Try using Drilldown Metrics to find the known metrics for HTTP servers and RPC servers, and note which label values you see.
        - Remember: In Grafana Cloud, OpenTelemetry resource attributes are **promoted** to Prometheus labels.
    - Check your analysis by inspecting traces from each service and look at its spans - are they decorated with <OtelSemconv type="span">rpc.service</OtelSemconv>, <OtelSemconv type="span">rpc.method</OtelSemconv> or <OtelSemconv type="span">http.method</OtelSemconv>, <OtelSemconv type="span">http.route</OtelSemconv>?

**Why it's important:** The semantic conventions of OpenTelemetry make your telemetry super-portable and queryable, across any service, regardless of the different languages or frameworks that your teams are using.

**In Grafana Cloud:** By instrumenting your workloads with OpenTelemetry, and adopting its semantic conventions, you gain a standardized inventory of your workloads and services.  In Grafana Cloud, The **Entity Catalog** view is populated from your services instrumented with OpenTelemetry, and other sources.

## Step 4: Understand context propagation

Now let's see how OpenTelemetry connects the dots across your distributed system. Context propagation is the mechanism that allows traces to span multiple services, creating a complete picture of a request's journey.

### Follow a request across services

1.  In Drilldown Traces, change the Filters to **All spans** and then search for traces including the **cartservice**.

1.  Click on a Trace to expand the view.

    Notice how the trace view shows the end-to-end flow of the trace that included calls to cartservice. The request flow will look something like this:

    ditl-demo-frontend-client → frontendproxy → cartservice → flagd

    Notice how a single **trace ID** combines all of these interactions into a single flow.

3.  Check out the trace timeline -- notice how you can see the latency of each service hop.

**Why it's important:** Context is the essential piece of information that makes distributed tracing work. Without passing (propagating) context between services, you'd only be able to see a bunch of disconnected traces. 

Context propagation ensures that each service passes some linking information to the next service. This allows Grafana Cloud to link the traces together, so you can see how a single request can touch many downstream services.

## Step 5: Correlate signals

Beyond connecting traces _across services_, OpenTelemetry enables correlation _between different types_ of signals - traces, logs, and metrics. This allows you to jump seamlessly from one signal type to another, when you're investigating issues.

### Navigate from traces to logs

1.  In Drilldown Traces, find a trace from the cartservice.

2.  Click on **Logs for this span** blue pill button.

3.  A Logs query opens in a split view, with the specific log lines from the given trace.

**Why it's important:** Correlating signals is crucial to helping you make sense of what an application is doing. When you troubleshoot applications that are fully instrumented with OpenTelemetry, you can navigate from performance metrics, to specific requests and traces for that service, and then down to individual events logged by your application during a request. This correlation happens because these signals (metrics, logs, traces) carry the same attributes.

**Real-world example:** Finding log messages for failing spans. With OTel, you can answer: why did a specific request fail, or why was it slow? What happened?

## Step 6: Analyze performance and troubleshoot

Now that you understand how to discover services, interpret semantic conventions, follow distributed traces, and correlate signals, let's put it all together to analyze performance and troubleshoot issues.

### Visualize service dependencies

1.  From the main menu, click on **Observability -> Entity Catalog** to open the Entity Catalog.

1.  In the **Environment** dropdown, clear any existing selections and choose **production**.

1.  Now you should see all the production services that make up our Astronomy Shop.

1.  Click on the **Service Map** tab to see the service topology in a single view.

1.  Find a service with high error rates, identified by a red circle around the entity.

1.  For the service that is failing, answer this question: is it the service itself that is failing, or one of its dependencies?

### Analyze service latency with standard metrics

Earlier in this workshop, you worked with metrics generated from trace spans in Grafana Cloud. This approach provides flexibility and fidelity, since you retain both the full request context from trace spans, in addition to metrics for alerting.

Additionally, OpenTelemetry automatically instruments many common HTTP and gRPC server libraries to emit standardized latency metrics, such as <OtelSemconv type="metric">http.server.request.duration</OtelSemconv> and <OtelSemconv type="metric">rpc.server.call.duration</OtelSemconv>. These metrics are available in Grafana Cloud Metrics, with consistent naming (remember: periods in names are converted to underscores in Prometheus).

1.  Navigate to **Drilldown -> Metrics**.

2.  Search for the metric `rpc_server_duration_milliseconds_bucket`.

3.  In the **job** panel, click on the **Select** button to see the histogram broken down by service.

    *Note: Grafana Cloud automatically promotes many other resource attributes to Prometheus metric labels, automatically writing the complex join queries (involving `target_info`) for you in the background.*

4.  Pick a service and click **Add to filters**. You can break down the metric even further, using standard OpenTelemetry resource attributes, like Kubernetes Pod name (<OtelSemconv>k8s.pod.name</OtelSemconv>), or service version (<OtelSemconv>service.version</OtelSemconv>).

5.  **How many instances of this service were running in the last hour? What are the pod names?**

:::opentelemetry-tip[Why 'job'?]

OTel has a convention for mapping service details to Prometheus-style labels. Your <OtelSemconv>service.name</OtelSemconv> and <OtelSemconv>service.namespace</OtelSemconv> become the `job` label (like `production/checkoutservice`), so you can filter metrics using standard Prometheus queries like `{job="production/checkoutservice"}`.

For more info, see https://opentelemetry.io/docs/specs/otel/compatibility/prometheus_and_openmetrics/#resource-attributes-1

:::

### Explore runtime environment metrics

Beyond application-level metrics, OpenTelemetry automatically instruments runtime environments to emit standardized metrics about the underlying platform - whether that's the JVM, .NET CLR, Node.js V8 engine, Go runtime, or others.

These metrics follow OpenTelemetry semantic conventions, allowing you to gain visibility into runtime performance characteristics that you might typically track, like memory usage, garbage collection, thread counts, and CPU utilization - all standardized across different languages and platforms.

1.  Navigate to **Drilldown -> Metrics**.

2.  Search for runtime metrics by trying patterns like:
    - `jvm_memory_*` for Java services
    - `process_runtime_*` for various runtime metrics (.NET, Python)
    - `go_*` for Go-specific metrics (like goroutines)

3.  Select a metric (e.g., `jvm_memory_used_bytes`) and in the **job** panel, click **Select** to see a breakdown of this metric by namespace and service.

4.  Add a filter for a specific service and explore how you can break down the metric using standard attributes like <OtelSemconv>jvm_memory_pool_name</OtelSemconv> or <OtelSemconv>jvm.memory.type</OtelSemconv>.

5.  Try answering this question: **Which Java service is using the most heap memory?**

6.  Try exploring metrics for other runtimes to understand health of the workloads in this system.

**Why it's important:** Runtime metrics give you deep visibility into how your applications are performing at the platform level. With OpenTelemetry's standardized approach, you can build unified dashboards and alerts that work across your entire polyglot application landscape - no need to learn different instrumentation libraries or metric naming conventions for each language.



[1]: https://github.com/grafana/opentelemetry-demo 
