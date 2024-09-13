# ARCH

![Transcandance](https://github.com/user-attachments/assets/57eb119a-846d-42a6-adce-798e753d9799)


# NOTES

views.py is where you define how Django handles requests and what kind of response it will send back. (THE API)

In a microservice architecture, separating services based on their functionality is key to achieving scalability, maintainability, and isolation. While combining the game and database into one container may seem like an optimization, it goes against the core principles of microservices.

Here's why you should avoid merging them:

Scalability: With separate containers, you can independently scale your game service and database based on their needs. For example, if the game logic becomes more resource-intensive, you can scale only the game service, not the database.

Fault Isolation: If the game logic fails or needs to be updated, having the database in a separate container ensures that the data layer remains unaffected.

Maintenance: Keeping the game logic and database separate allows for easier updates, debugging, and management. It’s easier to optimize each service individually when they are decoupled.

So, while merging might reduce the number of containers, the trade-offs in scalability, isolation, and maintainability outweigh the performance benefits in most cases. You should aim to keep them separate unless you have strong reasons to compromise on the benefits of microservice architecture.
