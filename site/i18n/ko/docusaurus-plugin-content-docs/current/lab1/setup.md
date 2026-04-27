---
sidebar_position: 1
---

# 1.1. 환경 초기화

## 1단계: 무료 계정 생성 및 Grafana Cloud 로그인

Grafana Labs에 직접 등록해 주세요.

1.  계정을 등록하려면 이 URL [grafana 등록](https://grafana.com/auth/sign-up/create-user?pg=login)로 이동하세요.

2.  등록 옵션 선택 화면이 나타나면, 인증 공급자 중 하나를 사용하는 것이 가장 편리합니다.
![alt text](/img/grafana_auth.png) 

3. 첫 번째 스택을 생성하고, **스택 URL을 선택하세요**. 이 워크숍에서는 지역을 Singapore로 선택해 주세요.
![alt text](/img/firststack.png) **새 스택을 생성하는 데 잠시 시간이 걸릴 수 있습니다.**

4. 온보딩 페이지에서 **이미 Grafana Cloud에 익숙합니다**를 선택하고 **설정 건너뛰기**를 클릭하세요.

5. **모든 데이터 연결 보기**를 선택하세요.

6. **Observability -> Application**으로 이동하세요.
![alt text](/img/navigate_o11y_app.png)

7. **Application Observability 활성화** 후 **데이터 연결**을 클릭하세요.

8. **OpenTelemetry (OTLP)**를 선택하고 단계별 절차를 따르세요.
    - 계측 방법 선택: **OpenTelemetry SDK**
    - 언어 선택: **Other**
    - 인프라 선택: **Linux**
    - 계측 방법 선택: **Grafana Alloy** 
    - Grafana Cloud 액세스 토큰 생성: **workshop-otel** 
    - 토큰 생성 
    - **⚠️ 이후 단계에서 사용할 토큰을 복사해 두세요.**
    - Alloy 설정 아래로 스크롤하여 **otel 경로와 사용자 이름을 복사하세요.**
    - ![alt text](/img/otelusernamepassword.png)
    
9. 이제 세 가지 정보를 갖게 됩니다. ⚠️ 다음 단계에서 Alloy를 구성할 때 필요하므로 보관하세요.
    - GRAFANA_CLOUD_OTLP_ENDPOINT = **"URL 엔드포인트"**
    - GRAFANA_CLOUD_OTLP_USERNAME = **"사용자 이름"**
    - GRAFANA_CLOUD_OTLP_PASSWORD = **"토큰"**


## 2단계: GitHub 계정에 로그인

1. GitHub 계정에 로그인하세요.

2. [https://github.com/hendritjipto/opentelemetry-workshop](https://github.com/hendritjipto/opentelemetry-workshop)로 이동하세요.

3. **Code**를 클릭한 후 **Codespaces**를 선택하여 이 저장소의 새 코드스페이스를 시작하세요.

![alt text](/img/codespace.png)

4. 원하는 테마로 변경하려면 오른쪽 상단의 **Command Palette** 아이콘을 클릭하세요.
    - 그런 다음 **theme**를 입력하여 목록에서 테마 명령을 찾으세요.
    - 원하는 테마를 선택하세요. 밝은 테마? 어두운 테마? 취향대로 선택하세요!

## 3단계: 데모 앱 실행

이 첫 번째 실습에서는 _Rolldice_라는 데모 애플리케이션을 사용합니다.

이 앱을 테스트해 보겠습니다:

1.  **Terminal -> New Terminal**로 이동하여 새 터미널을 시작하세요.

1.  터미널에서 다음 명령을 실행하여 첫 번째 프로젝트를 영구 작업 공간으로 복사하세요:

    ```
    cd ./source/rolldice/
    ```

1.  그런 다음, 다음 명령을 실행하여 애플리케이션을 시작하세요:

    ```
    ./run.sh
    ```

    애플리케이션이 시작됩니다.

1.  분할 터미널 아이콘(Terminal 1이 있는 탭 바의 오른쪽 끝에 위치)을 사용하거나 **Terminal -> New Terminal**로 이동하여 두 번째 터미널을 만드세요.

1.  두 번째 터미널에서 _curl_을 사용하여 rolldice 서비스에 샘플 요청을 보내세요:

    ```shell
    curl localhost:8080/rolldice
    ```

    rolldice 서비스가 랜덤 숫자를 반환합니다.

1.  탭을 클릭하여 첫 번째 터미널로 돌아간 다음 **Ctrl+C**를 눌러 애플리케이션을 중지하세요.

## 요약

이 실습에서 사용할 데모 애플리케이션을 실행해 보았습니다. 하지만 애플리케이션은 다소 고립되어 있고 아직 관찰되지 않았습니다!

다음 실습에서는 앱에 OpenTelemetry 계측을 추가하고 Grafana Cloud로 텔레메트리 신호를 전송하기 시작합니다.

아래의 다음 모듈을 클릭하여 계속 진행하세요.
