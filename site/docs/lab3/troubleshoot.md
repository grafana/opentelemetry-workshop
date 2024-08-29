---
sidebar_position: 2
---

# 3.1. Mission A: Troubleshoot

For this mission, we're letting you loose in our production environment. (Honestly!)

As well as running an observability company, we've begun to sell telescopes and other cosmic stargazing paraphernalia in a brand-new online store, all backed by microservices.

We've added OpenTelemetry instrumentation to all of our services, so we can monitor them more easily.

Before tackling the next lab, have a read through the architecture of the system.

## Understand the application

The application is based on the OpenTelemetry Demo, which is a microservice-based distributed system intended to illustrate the implementation of OpenTelemetry in a near real-world environment.

(TODO ARCHITECTURE DIAGRAM OF OPENTELEMETRY DEMO)

Your task for this lab is to use OpenTelemetry signals to find and troubleshoot two problems:

- One of our services has gone down, can you find out why?

- (TODO - ANOTHER SCENARIO, OPTIONAL)

## Step 1: Get ready

All of the services are located in the `production` environment.

1.  Go to your Grafana Cloud instance.

1.  From the main menu, click on **Application** to open Application Observability.

1.  In the **Environment** dropdown, clear any existing selections and choose **production**.

1.  Now you should see all of the production services that make up our Astronomy shop.

1.  Click on the **Service Map** tab to see the service topology in a single view.

You're ready to continue!

## Step 2: What's wrong with our services?

The Product Catalog service seems to be failing. Explore OpenTelemetry signals and find out why.

Tools you can use:

- Application Observability

    - Use the Service Inventory to quickly identify which service has a high error rate

    - Click into the Service to inspect the metrics in more detail

    - Are other services being affected? Or is another service causing the issue?

    - Can you drill down into erroring traces?

    - Do the Logs offer any information?

- Explore Logs

    - Drill down into logs by service_name

    - Use filters to find error logs

- Explore Metrics

- Write queries in Explore

<details>
    <summary>Click here for some hints</summary>

    In a real troubleshooting situation, you're up against time pressures. You need to find the root cause quickly. In complex microservice environments, that might mean multiple services appear to be impacted, but a single failing service is causing a knock-on chain of events.

    - Try looking at the frontend service first. Can you see which downstream services are affected?

    - Try looking at the product catalog service's database. Are there any issues?

    - Traces will often be marked with status `error` if there has been a problem. Do any traces have a status of "error"?

</details>


## Step 3: Another scenario

**TODO** - add another troubleshooting scenario.

