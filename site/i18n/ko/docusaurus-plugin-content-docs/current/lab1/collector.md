---
sidebar_position: 3
---

# 1.2. 컬렉터 구성

이 모듈에서는 애플리케이션에서 OpenTelemetry 신호를 수신하고 Grafana Cloud로 전송하는 컬렉터를 구성합니다.

## 1단계: Grafana Alloy 구성

Grafana Alloy는 OpenTelemetry Collector의 배포판으로, 강력한 텔레메트리 파이프라인을 구축하기 위한 Terraform 유사 구문을 제공합니다. Alloy를 사용하여 OpenTelemetry 신호를 수집하고 Grafana Cloud로 전송합니다.

:::opentelemetry-tip[OpenTelemetry 컬렉터란?]

OpenTelemetry Collector는 애플리케이션과 텔레메트리 백엔드 사이의 브릿지 역할을 합니다. 컬렉터는 여러 소스에서 신호를 수신하여 여러 대상으로 전송할 수 있습니다. 이를 통해 관찰 가능성 스택에서 매우 강력하고 유연한 구성 요소가 됩니다.

:::

이 워크숍에서는 Alloy를 사용하여 Grafana Cloud로 텔레메트리를 전송합니다. 데이터 흐름은 다음과 같습니다:

- 애플리케이션에서 OTLP 신호 수신
- Grafana Cloud로 전송

다음 단계를 따르세요:

1.  터미널에서 다음을 입력하세요:

    ```bash
    cd ./source/alloy
    ```

1.  Explorer 패널에서 `./source/alloy/config.alloy` 파일을 찾아 열어보세요. 구성 파일의 내용을 검토하면서 다음 사항에 주목하세요:

    - 애플리케이션에서 OTLP 신호를 수신하는 `otelcol.receiver.otlp` 블록이 있습니다.

    - Grafana Cloud의 OTLP 엔드포인트로 신호를 전송하는 `otelcol.exporter.otlphttp` 블록이 있습니다.

    이 파일을 수정할 필요는 없지만, Alloy 구성 파일이 어떻게 생겼는지 파악해 두는 것이 좋습니다.

    :::tip

    자신의 환경에서 OpenTelemetry를 구현하기 시작할 때, Grafana Cloud 인터페이스를 통해 Alloy 구성 파일을 생성할 수 있습니다. **Connections**로 이동하여 안내에 따르세요.

    :::

1.  Explorer 패널에서 새 파일 `./source/alloy/run.sh`를 찾아 열어보세요.

    이 스크립트는 Grafana Alloy를 실행합니다. 먼저 환경 변수를 설정해야 합니다:

    ```bash
    export GRAFANA_CLOUD_OTLP_ENDPOINT=""
    export GRAFANA_CLOUD_OTLP_USERNAME=""
    export GRAFANA_CLOUD_OTLP_PASSWORD=""
    ```
4. **⚠️ 👆🏻 이전 단계에서 얻은 값을 입력해 주세요.**


## 2단계: Grafana Alloy 실행

이제 Grafana Alloy를 실행할 준비가 되었습니다!

1.  터미널에서 다음 명령을 실행하여 Grafana Alloy를 시작하세요:

    ```bash
    ./run.sh
    ```

    Alloy가 시작되고 콘솔에 로그를 출력하기 시작하는 것을 볼 수 있습니다.

    로그에서 "Starting GRPC server"와 "Starting HTTP server" 같은 두 개의 로그 라인이 보일 것입니다. 이는 Alloy가 OTLP 데이터를 수신하기 위해 두 개의 포트를 열었음을 의미합니다. Alloy가 준비되었습니다.

축하합니다! 컬렉터를 실행하여 OpenTelemetry 신호를 수집하고 내보내는 첫 번째 단계를 완료했습니다.

:::opentelemetry-tip

이 워크숍의 목적과 단순함을 유지하기 위해, 개발 환경 내에서 독립적인 포그라운드 인스턴스의 Grafana Alloy를 실행하고 있습니다.

하지만 프로덕션 환경에서는 다른 토폴로지로 Alloy를 실행할 수 있습니다. 예를 들어, Kubernetes를 실행 중이라면 클러스터의 모든 파드에서 OTel 신호를 수집하기 위해 Alloy를 배포하는 Grafana의 Kubernetes Monitoring Helm 차트를 사용할 수도 있습니다.

자세한 내용은 [Alloy 문서](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/collector/grafana-alloy-kubernetes/)를 참조하세요.

:::

## 요약

이 모듈에서는 애플리케이션에서 OpenTelemetry 신호를 수신하고 Grafana Cloud로 전송하는 컬렉터를 구성했습니다.

또한 Grafana Alloy를 구성하고 개발 환경에서 실행하는 방법도 배웠습니다.

다음 모듈에서는 애플리케이션이 Grafana Alloy로 OpenTelemetry 신호를 전송하도록 계측하는 방법을 배웁니다.
