all:
	@docker-compose -f docker-compose.yml up

down:
	@docker-compose -f docker-compose.yml down

re:
	@docker-compose -f docker-compose.yml up --build

clean:
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker network rm $$(docker network ls | grep trans | cut -d' ' -f1)
	sudo rm -rf ./data/user_db_data
	sudo rm -rf ./data
# docker volume rm $$(docker volume ls -q);\
# rm -rf game_service/staticfiles
# rm -rf game_service/pingpong/migrations
# docker rmi -f $$(docker images -qa);\

.PHONY: all re down clean