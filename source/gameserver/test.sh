#!/bin/sh

curl -H 'Content-type: application/json' localhost:8090/play -d '{ "name": "Mike" }'
