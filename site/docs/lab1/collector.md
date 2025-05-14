---
sidebar_position: 3
---

# 1.2. Configure a Collector

In this module, we will configure a collector to receive OpenTelemetry signals from our application, and ship them to Grafana Cloud.

## Step 1: Configure Grafana Alloy

Grafana Alloy is a distribution of the OpenTelemetry Collector, with a Terraform-like syntax for building powerful telemetry pipelines. We will use Alloy to collect and ship your OpenTelemetry signals to Grafana Cloud.

:::opentelemetry-tip[What is an OpenTelemetry collector?]

An OpenTelemetry Collector acts as a bridge between your applications and your telemetry backends. The Collector can receive signals from multiple sources, and send them to multiple destinations. It can also perform transformations on the signals, such as filtering or aggregating them.

:::

For this workshop, we've prepared an Alloy configuration file for you. This configuration will:

- Receive OTLP signals from your application
- Send them to Grafana Cloud

Follow these steps:

1.  In the terminal, type the following to copy the example Alloy config file into your persistent workspace:

    ```bash
    cp -r /opt/alloy /home/project/persisted/
    ```

1.  Find the new file `persisted/alloy/config.alloy` in the Explorer pane, and open it. Review the content of the configuration file, noting that:

    - There is an `otelcol.receiver.otlp` block, which receives OTLP signals from your application.

    - There is an `otelcol.exporter.otlphttp` block, which sends the signals to Grafana Cloud's OTLP endpoint.

    You don't need to do anything with this file, but it's good to know what an Alloy configuration file looks like.

    :::tip

    When you begin to implement OpenTelemetry in your own environment, you can use the Grafana Cloud interface to generate an Alloy configuration file. Navigate to **Connections** and follow the integration tiles to add an OpenTelemetry source.

    :::

1.  Find the new file `persisted/alloy/run.sh` in the Explorer pane, and open it.

    This script will run Grafana Alloy. You will see that we need to set some environment variables first:

    ```bash
    export GRAFANA_CLOUD_OTLP_ENDPOINT=""
    export GRAFANA_CLOUD_OTLP_USERNAME=""
    export GRAFANA_CLOUD_OTLP_PASSWORD=""
    ```
    
Let's fill in these variables with the connection details we will get from Grafana Cloud in the next step.

## Step 2: Get Grafana Cloud connection details

In this step, we will grab the endpoint, username and password you need to send your OpenTelemetry signals to Grafana Cloud:

1.  Go to your Grafana Cloud instance. 

1.  In the side menu, click on **Dashboards**, open the **Field Eng Otel Environment** folder, and navigate to the dashboard **Connection Details**. You can also search for the dashboard by typing "Connection Details" in the search bar.

1.  On the _Connection Details_ dashboard, copy the **OpenTelemetry (OTLP) endpoint** and paste it in the `alloy/run.sh` file, in the `GRAFANA_CLOUD_OTLP_ENDPOINT` environment variable, similar to this:

    ```bash
    export GRAFANA_CLOUD_OTLP_ENDPOINT="https://..."
    ```

1.  Copy the **OpenTelemetry (OTLP) user ID** and paste it in the `alloy/run.sh` file, in the `GRAFANA_CLOUD_OTLP_USERNAME` environment variable, similar to this:

    ```bash
    export GRAFANA_CLOUD_OTLP_USERNAME="123456"
    ```

1.  Next, we'll generate a new Cloud Access Policy token to send to Grafana Cloud. In the Grafana side menu, navigate to **Administration &rarr; Users and access &rarr; Cloud access policies**.

1.  Look for a policy which has a name similar to **xxxx-telemetry-publisher-wsa**, expand the Tokens panel, and click **Add token**.

1.  Give the token a name of your choosing and ensure expiry is set to **No expiry**, then click **Create**.

1.  **Copy** the generated token to your clipboard, and paste it in your `alloy/run.sh` file, placing it in the `GRAFANA_CLOUD_OTLP_PASSWORD` environment variable.

    ```bash
    export GRAFANA_CLOUD_OTLP_PASSWORD="glc_..."
    ```

1.  **Save** the file once you're finished editing.

## Step 2: Run Grafana Alloy

Now we're ready to run Grafana Alloy!

1.  In the terminal, run the following command to start Grafana Alloy:

    ```bash
    cd /home/project/persisted/alloy

    ./run.sh
    ```

    You should see Alloy start up, and begin to write some logs to the console. 

    In the logs, you will see two log lines, like "Starting GRPC server" and "Starting HTTP server". This means that Alloy has opened two ports, for receiving OTLP data. Alloy is ready to go.

Congratulations! You've just made the first step to collecting and exporting OpenTelemetry signals, by running a collector.

:::opentelemetry-tip

For the purposes of this workshop, and to keep things simple, you're running a standalone, foreground instance of Grafana Alloy, inside your development environment.

But in production, you may run Alloy in a different topology. For example, if you're running Kubernetes, you might use Grafana's Kubernetes Monitoring Helm chart, which deploys Alloy to collect OTLP signals from your applications **and** also Prometheus metrics from your underlying Kubernetes infrastructure.

See [the Alloy documentation](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/collector/grafana-alloy-kubernetes/) for more information.

:::

## Summary

In this module, you have configured a collector to receive OpenTelemetry signals from your application, and ship them to Grafana Cloud.

You have also learned how to configure Grafana Alloy, and how to run it in your development environment.

In the next module, you will learn how to instrument your application to send OpenTelemetry signals to Grafana Alloy.


