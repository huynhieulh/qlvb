<<<<<<< HEAD
# start docker
#set -x
#docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d
=======
#start docker
set -x
docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d --remove-orphans
>>>>>>> b5b34d3c606f4b5550d66e3d7807f85dbd69fc11
docker exec -it cli bash
