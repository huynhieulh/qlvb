#start docker
set -x
docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d --remove-orphans
docker exec -it cli bash
