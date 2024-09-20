#!/bin/bash

export OTEL_EXPORTER_OTLP_INSECURE="true" # use http instead of https (needed because of https://github.com/open-telemetry/opentelemetry-go/issues/4834)

# ADD your OpenTelemetry configuration environment variables here

go run . "$@"
