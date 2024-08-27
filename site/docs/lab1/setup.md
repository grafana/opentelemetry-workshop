---
sidebar_position: 1
---

# 1.1. Check your setup

## Step 1: Log on to Grafana

You've been given access to a Grafana Cloud instance for the purposes of this workshop.

1.  Go to `https://xxxxx.grafana.net` (where `xxxxx` is a unique string that identifies your Grafana Cloud instance).

1.  Click **Login with SSO**.

1.  At the login screen, enter the **username** and **password** that you were given by your instructor.

    :::info

    If you didn't receive a username and password, please speak to your friendly facilitator!

    :::

## Step 2: Log on to your IDE

You've also been given access to an online development environment.

1.  Go to `https://xxxxx.work-shop.grafana.net` (the URL to this environment will be given by your instructor.)

1.  Click **Start Lab**. (Or click **Login** if you have not already logged in.)

1.  Verify that your lab environment looks good.

1.  Change the theme as you prefer - click the _Terminal_ icon in the top right and type `theme` to find the Theme command.

    - Select a theme of your choice. Light? Dark? Whatever you prefer!

## Step 3: Run the demo app

In this first lab, we'll be working with demo application called _Rolldice_.

Let's test out this app:

1.  Open your virtual development environment.

1.  Launch a new Terminal by going to **Terminal -> New Terminal**

1.  In the terminal, type the following:

    ```
    cd rolldice

    ./run.sh
    ```

    The application starts.

1.  Create a second terminal, either using the split terminal icon, or by going to **Terminal -> New Terminal**.

1.  In the second terminal, use _curl_ to make a sample request to the rolldice service:

    ```shell
    curl localhost:8080/rolldice
    ```

1.  In the first terminal, press **Ctrl+C** to stop the application.

## Summary

Right now, this demo app isn't very interesting.

In the next lab, we'll add OpenTelemetry instrumentation to the app and start shipping signals to Grafana Cloud.

Click Next below to proceed to the next module in this lab.

