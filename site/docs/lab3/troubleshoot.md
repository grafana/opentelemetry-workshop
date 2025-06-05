---
sidebar_position: 2
---

# 3.2. Mission A: Troubleshoot

For this mission, we're letting you loose in our production environment. (Honestly!)

As well as running an observability company, Grafana has branched out into selling telescopes and other cosmic stargazing paraphernalia in a brand-new online store, all backed by microservices.

We've added OpenTelemetry instrumentation to all of our services, so we can monitor them more easily.

The application is based on the [OpenTelemetry Demo][1], which is a microservice-based distributed system intended to illustrate the implementation of OpenTelemetry in a near real-world environment.

![Astronomy Shop homepage](/img/oteldemo_homepage.png)

Your task for this lab is to use OpenTelemetry signals to find and troubleshoot a problem: **one of our services is failing and causing issues, can you find out why?**

## Step 1: Get ready

All of the services are located in the `production` environment.

1.  Go to your Grafana Cloud instance.

1.  From the main menu, click on **Application** to open Application Observability.

1.  In the **Environment** dropdown, clear any existing selections and choose **production**.

1.  Now you should see all of the production services that make up our Astronomy Shop.

1.  Click on the **Service Map** tab to see the service topology in a single view.

You're ready to continue!

## Step 2: What's wrong with our services?

The Product Catalog service seems to be failing. Explore OpenTelemetry signals and find out why.

1.  Using the tools in your Grafana Cloud instance, try to find the reason that the Product Catalog Service is failing.

1.  Once you've discovered the root cause, can you figure out when, or why it started happening? Do OpenTelemetry resource attributes help?


Tools you can use:

| Tool | How it can help you |
| ---- | ------------------- |
| Application Observability | - Use the Service Inventory to quickly identify which service has a high error rate<br/>- Click into the Service to inspect the metrics in more detail<br/>- Can you drill down into erroring traces?<br/>- Do the Logs offer any information? |
| Explore Logs | - Drill down into logs by service_name<br/>- Use filters to find error logs<br/>- Find patterns of logs which might indicate there's an error |
| Explore | - Write your own ad-hoc Loki, Tempo or Prometheus queries |

If you want some more hints, click the reveal bar below:

<details>
    <summary>Click here for some more hints</summary>

    In a real troubleshooting situation, you're up against time pressures. You need to find the root cause quickly. In complex microservice environments, that might mean multiple services appear to be impacted, but a single failing service is causing a knock-on chain of events.

    - Try looking at the frontend service first. Can you see which downstream services are affected?

    - Try looking at the product catalog service's database. Are there any issues?

    - Traces will often be marked with status `error` if there has been a problem. Do any traces have a status of "error"?

    - Do you notice if any OpenTelemetry resource attributes changed at the same time as the error started?

</details>

[1]: https://github.com/grafana/opentelemetry-demo 
