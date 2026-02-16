---
sidebar_position: 2
---

# 3.2. Mission A: Explore a reference environment

For this mission, we're giving you access to a fully configured **OpenTelemetry reference environment in Grafana Cloud**.

In this environment, we've added OpenTelemetry instrumentation to all of our services, so you can explore and see what a near real-world environment looks like in Grafana Cloud.

The environment is based on the [OpenTelemetry Demo][1], which is a microservice-based distributed system, instrumented with OpenTelemetry.

![Astronomy Shop homepage](/img/oteldemo_homepage.png)

## Step 1: Get ready

Log on to the environment to get started:

1.  Go to the **Reference Grafana URL** that you have been given (Hint: the URL looks like `https://abcd12appenv.grafana.net`).

1.  If you are presented with a choice of sign-in options, click **Sign in with SSO**.

1.  At the _Authentication_ login screen, enter the **username** (not email) and **password** that you received by email, or from your instructor.

Tools you can use to explore OpenTelemetry signals in Grafana Cloud:

| Tool                      | How it can help you                                                                                                                                                                                                                          |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Entity Catalog            | - Use the Entity Catalog to quickly identify which services have a high error rate<br/>- Click into the Service to inspect the metrics in more detail<br/>- Can you drill down into erroring traces?<br/>- Do the Logs offer any information? |
| Logs Drilldown            | - Drill down into logs by service_name<br/>- Use filters to find error logs<br/>- Find patterns of logs which might indicate there's an error                                                                                                |
| Explore                   | - Write your own Loki, Tempo or Prometheus queries                                                                                                                                                                                     |


## Step 2: Discover services and understand the environment

Use OpenTelemetry resource attributes to understand what's running, and where.

### Understand workloads

OpenTelemetry can tell us a lot about workloads, and their underlying infrastructure. Explore this environment and see if you can answer these questions:

- **How many services are running?** (Hint: use the Entity Catalog)

- **Which version of each service is running?** (Hint: find a trace use the `service.version` attribute, or use the Entity Catalog and add Service Version as a column)

- **In which cloud provider and region are these services deployed?** (Hint: search for traces and look in the *resource attributes*, or find the information in Entity Catalog)

- **What is the name of the Kubernetes node which the _checkoutservice_ is running on?**
    - Hint: this service is called from other services. So if you are searching Drilldown Traces, don't forget to change the filter to "All spans" (not "Root spans")

### Explore OpenTelemetry semantic conventions

Semantic conventions standardise the way that this information is exported from applications, which makes it easier to visualise everything together.

1.  Navigate to **Drilldown -> Traces**.

2.  Find traces for the **ditl-demo-frontend-client** service.

3.  Open an example trace and examine the span attributes:

    - **HTTP spans:** Look for `http.method`, `http.route`, `http.status_code`
    - **RPC spans:** Find `rpc.service`, `rpc.method` (gRPC calls)
    - **Database spans:** Check for `db.system`, `db.statement`, `db.name`

4.  Compare a couple of services -- notice how OpenTelemetry auto-instrumentation creates consistent attribute naming, irrespective of the language or framework.

5.  Navigate to **Drilldown -> Metrics**

6.  Answer the question: **Which services use gRPC, and which use HTTP?**
    - Hint: Try using Drilldown Metrics to find the known metrics for HTTP servers and gRPC servers, and note which label values you see.
        - Remember: OpenTelemetry resource attributes are **promoted** to Prometheus labels in Grafana Cloud.
        - Check your work by inspecting traces from each service and look at its spans - are they decorated with `rpc.service`, `rpc.method` or `http.method`, `http.route`?

**Why it's important:** The semantic conventions of OpenTelemetry make your telemetry super-portable and queryable, across any service, regardless of the different languages or frameworks that your teams are using.

**In Grafana Cloud:** OpenTelemetry can act as an automatic catalog of your production environment. By instrumenting your workloads with OpenTelemetry, and adopting its semantic conventions, you gain a standardized way of cataloging workloads and services.  In Grafana Cloud, The **Entity Catalog** view is populated from your OpenTelemetry services and other sources.

## Step 3: Correlating signals and context propagation

How OpenTelemetry links traces, logs and metrics together.

### View context propagation across a request flow

We'll see how OpenTelemetry Trace Context propagation allows us to make sense of complex distributed systems, like this one.

1.  In Drilldown Traces, change the Filters to **All spans** and then search for traces including the **cartservice**.

1.  Click on a Trace to expand the view.

    Notice how the trace view shows the end-to-end flow of the trace that included calls to cartservice. The request flow will look something like this:

    ditl-demo-frontend-client → frontendproxy → cartservice → flagd

    Notice how a single **trace ID** combines all of these interactions into a single flow.

3.  Check out the trace timeline -- notice how you can see the latency of each service hop.

**Why it's important:** Context is the essential piece of information that makes distributed tracing work. Without passing (propagating) context between services, you'd only be able to see a bunch of disconnected traces. 

Context propagation ensures that each service passes some linking information to the next service. This allows Grafana Cloud to link the traces together, so you can see how a single request can touch many downstream services.

### Correlate logs with metrics

OpenTelemetry includes mechanisms for correlating signals.

1.  In Drilldown Traces, find a trace from the cartservice.

2.  CLick on **Logs for this span** blue pill button.

3.  A Logs query opens in a split view, with the specific log lines from the given trace.

**Why it's important:** Correlating signals is crucial to helping you make sense of what an application is doing. When you're troubleshooting applications fully instrumented with OpenTelemetry, you can navigate from performance metrics, to specific requests and traces for that service, and then down to individual events logged by your application. This correlation can only take place because these signals carry the same attributes.

**Example use case:** Finding log messages for failing spans. Why did a specific request fail, or why was it slow? What happened?

## Step 4: Performance analysis & troubleshooting

### Understand the service graph

1.  From the main menu, click on **Observability -> Entity Catalog** to open the Entity Catalog.

1.  In the **Environment** dropdown, clear any existing selections and choose **production**.

1.  Now you should see all the production services that make up our Astronomy Shop.

1.  Click on the **Service Map** tab to see the service topology in a single view.

1.  Find a service with high error rates, identified by a red circle around the entity.

1.  For the service that is failing, answer this question: is it the service itself that is failing, or one of its dependencies?

### See service latency metrics

Earlier in this workshop, you worked with metrics generated from trace spans, in Grafana Cloud. This solution brings a lot of flexibility and fidelity, since spans contain the full request context.

But OpenTelemetry also automatically instruments many common HTTP and gRPC server libraries, to emit standard latency metrics, such as `http.server.request.duration`, or `grpc.server.duration`. These are available in Grafana Cloud Metrics, with consistent naming (periods are converted to underscores).

1.  Navigate to **Drilldown -> Metrics**.

2.  Search for the metric `rpc_server_duration_milliseconds_bucket`.

3.  In the **job** panel, click on the **Select** button to see the histogram broken down by service.

    *Note: Grafana Cloud automatically promotes many other resource attributes to Prometheus metric labels, automatically writing the complex join queries (involving `target_info`) for you in the background.*

4.  Pick a service and click **Add to filters**. You can break down the metric even further, using standard OpenTelemetry resource attributes, like Kubernetes Pod name (`k8s_pod_name`), or service version (`service_version`).

:::opentelemetry-tip[Why 'job'?]

OTel has a convention for mapping service details to Prometheus-style labels. Your `service.name` and `service.namespace` become the `job` label (like `production/checkoutservice`), so you can filter metrics using standard Prometheus queries like `{job="production/checkoutservice"}`.

For more info, see https://opentelemetry.io/docs/specs/otel/compatibility/prometheus_and_openmetrics/#resource-attributes-1

:::

### See standardised virtual machine metrics

- Talk about JVM or Go metrics here

**Explore OpenTelemetry metrics without having to write queries.**

Which Java application uses the most memory?

(Hint: Drilldown Metrics -> jvm_gc_xxx metrics -> group by "instance" or "job")



[1]: https://github.com/grafana/opentelemetry-demo 
