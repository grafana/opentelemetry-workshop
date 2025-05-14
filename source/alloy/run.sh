#!/bin/sh

export GRAFANA_CLOUD_OTLP_ENDPOINT=""
export GRAFANA_CLOUD_OTLP_USERNAME=""
export GRAFANA_CLOUD_OTLP_PASSWORD=""

alloy run config.alloy
