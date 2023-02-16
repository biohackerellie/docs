# Grafana loki setup

## Setup Container


### Create Container Config folders
In working directory, in our case ``/etc/``

```bash
sudo mkdir grafana
sudo mkdir loki
sudo mkdir promtail
```
### Create Docker Compose and Config files

**Grafana Docker Compose:**

``sudo nano grafana/docker-compose.yml``

In the compose file, copy: 
```yml
version: "3"
networks:
  loki:
services:
  loki:
    image: grafana/loki:2.4.0
    volumes:
      - /etc/loki:/etc/loki
    ports:
      - "3100:3100"
    restart: unless-stopped
    command: -config.file=/etc/loki/loki-config.yml
    networks:
      - loki
  promtail:
    image: grafana/promtail:2.4.0
    volumes:
      - /var/log:/var/log
      - /etc/promtail:/etc/promtail
    # ports:
    #   - "1514:1514" # this is only needed if you are going to send syslogs
    restart: unless-stopped
    command: -config.file=/etc/promtail/promtail-config.yml
    networks:
      - loki
  grafana:
    image: grafana/grafana:latest
    user: "1000"
    volumes:
    - /etc/grafana:/var/lib/grafana
    ports:
      - "4269:3000"
    restart: unless-stopped
    networks:
      - loki
volumes:
  loki:
  grafana:
  promtail:
```
**Loki Config File:**

``sudo nano loki/loki-config.yml``

In the config file:
```yml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2023-02-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093
```
**Promtail Config File:**

``sudo nano promtail/promtail-config.yml``

in the config file:
```yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:

# local machine logs

- job_name: local
  static_configs:
  - targets:
      - localhost
    labels:
      job: varlogs
      __path__: /var/log/*log
  
## docker logs

#- job_name: docker 
pipeline_stages:
  - docker: {}
static_configs:
  - labels:
      job: docker
      __path__: /var/lib/docker/containers/*/*-json.log

#syslog target

- job_name: syslog
syslog:
  listen_address: 0.0.0.0:1514 # make sure you also expose this port on the container
  idle_timeout: 60s
  label_structured_data: yes
  labels:
    job: "syslog"
relabel_configs:
  - source_labels: ['__syslog_message_hostname']
    target_label: 'host'
```
### Install the DOcker Containers

```bash
#Make sure you are in your grafana folder
cd /etc/grafana
#run docker compose
sudo docker-compose up -d --force-recreate
```

## Loki Docker Driver
Install docker plugin
```bash
sudo docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```
edit docker daemon config
```bash
sudo nano /etc/docker/daemon.json
```
```json
{
    "log-driver": "loki",
    "log-opts": {
        "loki-url": "http://localhost:3100/loki/api/v1/push",
        "loki-batch-size": "400"
    }
}
```
Restart docker daemon.
```bash
sudo systemctl restart docker
```
You will need to recreate the containers after completing this step or manking any other config changes
```bash
cd /etc/grafana
sudo docker-compose up -d --force-recreate
```

## Log QL sample Queries
Query all logs from the varlogs stream
```Sql
{job="varlogs"}
```
Query all logs from the ``varlogs stream`` and filter on ``docker``

```Sql
{job="varlogs"} |= "docker"
```
Query all logs from the ``container_name`` label of ``UptimeNotifications``
```Sql
{container_name="UptimeNotifications"}
```