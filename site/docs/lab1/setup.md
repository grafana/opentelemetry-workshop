---
sidebar_position: 1
---

# 1.1. Initialize your environment

## Step 1: Log on to Grafana

You've been given access to a Grafana Cloud instance for the purposes of this workshop.

1.  Go to the **Grafana URL** that you have been given (usually: `https://xxxxx.grafana.net`).

1.  If you are presented with a choice of sign-in options, click **Sign in with SSO**.

1.  At the _Grafana Labs Workshops_ login screen, enter the **username** (not email) and **password** that you were given by your instructor.

    :::info

    If you didn't receive a username and password, please speak to your friendly instructor!

    :::

## Step 2: Log on to your IDE

You've also been given access to an online development environment. You'll be using this to complete the lab exercises.

1.  Go to the **IDE URL** that has been shared with you. 

1.  Click **Launch OpenTelemetry Workshop**. (Or click **Login** if you have not already logged in.)

1.  Verify that your lab environment looks good.

1.  Change the theme to suit your preference: click on the **Command Palette** icon located in the top right:

    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path fill-rule="evenodd" d="M1.5 3L3 1.5h18L22.5 3v18L21 22.5H3L1.5 21zM3 3v18h18V3z" clip-rule="evenodd"/><path d="M7.06 7.5L6 8.56l4.243 4.243L6 17.046l1.06 1.06L12 13.168v-.728zm4.94 9h6V18h-6z"/></g></svg>

    - Then type **theme** to find the Theme command in the list.

    - Then, select a theme of your choice. Light? Dark? Whatever you prefer!

## Step 3: Run the demo app

In this first lab, we'll be working with demo application called _Rolldice_.

Let's test out this app:

1.  Open your virtual development environment.

1.  Launch a new Terminal by going to **Terminal -> New Terminal**

1.  In the terminal, run the following command to copy the first project into your persistent workspace:

    ```
    cp -r /opt/rolldice persisted/
    ```

1.  Then, run the following commands to start the application:

    ```
    cd persisted/rolldice

    ./run.sh
    ```

    The application starts.

1.  Create a second terminal, either using the split terminal icon (located at the right edge of the tab bar where "Terminal 1" is located), or by going to **Terminal -> New Terminal**.

1.  In the second terminal, use _curl_ to make a sample request to the rolldice service:

    ```shell
    curl localhost:8080/rolldice
    ```

    The rolldice service returns a random number.

1.  Change back to the first terminal by clicking on its tab, then press **Ctrl+C** to stop the application.

## Summary

You've just run the demo application that we'll use in this lab. However, the application is rather isolated, and so far un-observed! 

In the next lab, we'll add OpenTelemetry instrumentation to the app, and begin shipping telemetry signals to Grafana Cloud.

Click on the next module below to proceed.

