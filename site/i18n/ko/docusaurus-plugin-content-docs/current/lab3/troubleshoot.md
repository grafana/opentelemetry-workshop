---
sidebar_position: 2
---

# 3.2. 미션 A: 문제 해결

이 미션에서는 프로덕션 환경에서 자유롭게 탐색할 수 있습니다. (정말입니다!)

관찰 가능성 회사를 운영하는 것 외에도, Grafana는 마이크로서비스 기반의 새로운 온라인 스토어에서 망원경과 기타 천체 관측 상품을 판매하는 사업도 시작했습니다.

모든 서비스에 OpenTelemetry 계측을 추가하여 더 쉽게 모니터링할 수 있습니다.

애플리케이션은 [OpenTelemetry Demo][1]를 기반으로 하며, 실제에 가까운 환경에서 OpenTelemetry 구현을 보여주기 위한 마이크로서비스 기반 분산 시스템입니다.

![Astronomy Shop homepage](/img/oteldemo_homepage.png)

이 실습의 과제는 OpenTelemetry 신호를 사용하여 문제를 찾고 해결하는 것입니다: **서비스 중 하나에 장애가 발생하여 문제가 생기고 있습니다. 원인을 찾을 수 있나요?**

## 1단계: 준비

모든 서비스는 `production` 환경에 있습니다.

1.  Grafana Cloud 인스턴스로 이동하세요.

1.  메인 메뉴에서 **Application**을 클릭하여 Application Observability를 여세요.

1.  **Environment** 드롭다운에서 기존 선택을 지우고 **production**을 선택하세요.

1.  이제 Astronomy Shop을 구성하는 모든 프로덕션 서비스가 표시됩니다.

1.  **Service Map** 탭을 클릭하여 단일 뷰에서 서비스 토폴로지를 확인하세요.

계속할 준비가 되었습니다!

## 2단계: 서비스에 무슨 문제가 있나요?

Product Catalog 서비스가 실패하고 있는 것 같습니다. OpenTelemetry 신호를 탐색하여 원인을 찾아보세요.

1.  Grafana Cloud 인스턴스의 도구를 사용하여 Product Catalog Service가 실패하는 이유를 찾아보세요.

1.  근본 원인을 발견했으면, 언제 또는 왜 발생하기 시작했는지 알아볼 수 있나요? OpenTelemetry 리소스 속성이 도움이 되나요?


사용할 수 있는 도구:

| 도구 | 도움이 되는 방법 |
| ---- | ------------------- |
| Application Observability | - 서비스 인벤토리를 사용하여 높은 오류율을 가진 서비스를 빠르게 식별<br/>- 서비스를 클릭하여 메트릭을 자세히 검사<br/>- 오류 트레이스로 드릴다운할 수 있나요?<br/>- 로그가 정보를 제공하나요? |
| Explore Logs | - service_name으로 로그 드릴다운<br/>- 필터를 사용하여 오류 로그 찾기<br/>- 오류가 있음을 나타낼 수 있는 로그 패턴 찾기 |
| Explore | - 자체 임시 Loki, Tempo 또는 Prometheus 쿼리 작성 |

더 많은 힌트가 필요하면 아래 공개 바를 클릭하세요:

<details>
    <summary>더 많은 힌트를 보려면 클릭하세요</summary>

    실제 문제 해결 상황에서는 시간 압박이 있습니다. 근본 원인을 빠르게 찾아야 합니다. 복잡한 마이크로서비스 환경에서는 여러 서비스가 영향을 받는 것처럼 보일 수 있지만, 단일 실패 서비스가 연쇄적인 이벤트를 일으킬 수 있습니다.

    - 먼저 frontend 서비스를 살펴보세요. 어떤 다운스트림 서비스가 영향을 받는지 볼 수 있나요?

    - product catalog 서비스의 데이터베이스를 살펴보세요. 문제가 있나요?

    - 문제가 있을 때 트레이스가 `error` 상태로 표시될 수 있습니다. 어떤 트레이스에 "error" 상태가 있나요?

    - 오류가 시작된 것과 동시에 OpenTelemetry 리소스 속성이 변경된 것을 알 수 있나요?

</details>

[1]: https://github.com/grafana/opentelemetry-demo 
