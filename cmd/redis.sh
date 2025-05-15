#!/usr/bin/env bash
docker run --name redis -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
