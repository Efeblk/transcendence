all:
	@docker compose -f docker-compose.yml up

down:
	@docker compose -f docker-compose.yml down

re:
	@docker compose -f docker-compose.yml up --build

clean:
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker volume rm $$(docker volume ls -q);\
	docker network rm $$(docker network ls | grep trans | cut -d' ' -f1)

# rm -rf game_service/staticfiles
# docker rmi -f $$(docker images -qa);\

.PHONY: all re down clean