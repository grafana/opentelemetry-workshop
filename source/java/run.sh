#!/bin/bash

set -euo pipefail

if [[ ! -f ./target/rolldice-0.0.1-SNAPSHOT.jar ]] ; then
    ./mvnw clean package
fi
version=v2.1.0
jar=opentelemetry-javaagent-${version}.jar
if [[ ! -f ./${jar} ]] ; then
    curl -sL https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/${version}/opentelemetry-javaagent.jar -o ${jar}
fi
export OTEL_RESOURCE_ATTRIBUTES="service.name=rolldice,deployment.environment=local,service.version=1.0-demo,service.instance.id=localhost:8080"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
#export OTEL_TRACES_EXPORTER=logging
#export OTEL_METRICS_EXPORTER=logging
#export OTEL_LOGS_EXPORTER=logging

# uncomment the next line to switch to Prometheus native histograms.
# export OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION=base2_exponential_bucket_histogram
java -Dotel.metric.export.interval=500 -Dotel.bsp.schedule.delay=500 -javaagent:${jar} -jar ./target/rolldice-0.0.1-SNAPSHOT.jar
