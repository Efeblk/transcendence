# ARCH

![Transcandance](https://github.com/user-attachments/assets/d8ef830a-c6d6-46e7-8b59-16edb4ba8c15)



# NOTES

views.py is where you define how Django handles requests and what kind of response it will send back. (THE API)

In a microservice architecture, separating services based on their functionality is key to achieving scalability, maintainability, and isolation. While combining the game and database into one container may seem like an optimization, it goes against the core principles of microservices.

Here's why you should avoid merging them:

Scalability: With separate containers, you can independently scale your game service and database based on their needs. For example, if the game logic becomes more resource-intensive, you can scale only the game service, not the database.

Fault Isolation: If the game logic fails or needs to be updated, having the database in a separate container ensures that the data layer remains unaffected.

Maintenance: Keeping the game logic and database separate allows for easier updates, debugging, and management. It’s easier to optimize each service individually when they are decoupled.

So, while merging might reduce the number of containers, the trade-offs in scalability, isolation, and maintainability outweigh the performance benefits in most cases. You should aim to keep them separate unless you have strong reasons to compromise on the benefits of microservice architecture.

http://ip-of-vm  : sanal makinenin ip adresini girerek local bilgisayardan bağlanabilirsiniz. sanal makinemde bu komutu girdim: sudo ufw allow 'Nginx Full'


#### OAuth 2.0 kısaa nasıl çalışır?
1- Uygulamanız (istemci) erişim talep eder.
2- Kullanıcı izin ekranını görür ("X Uygulaması Y'ye erişmek istiyor").
3- Kullanıcı onaylar.
4- Uygulama erişim belirtecini (access token) alır.
5- Uygulama verilere erişmek için bu token'ı kullanır.

Here's a simple example of Authorization Code flow:
1. Client redirects to:
GET https://auth-server.com/auth?
  response_type=code&
  client_id=123&
  redirect_uri=https://client.com/callback

2. User approves, receives:
https://client.com/callback?code=ABC123

3. Client exchanges code for token:
POST https://auth-server.com/token
  code=ABC123&
  client_id=123&
  client_secret=SECRET


#### test edilmesi gerekebilir
- signup 403 (uzak masaüstüne ssh ile girince sign up çalışmıyor)
- game 400 (localde çalışıyor aynı ağdaki cihaz girdiğinde çalışmıyor 400 veriyor)


### Yapılacaklar

*** GAME ****

- players:
      Therefore, users must have the ability to participate in a live Pong game against another player directly on the website. Both players will use the same keyboard. The Remote players module can enhance this functionality with remote players.
- tournament:
      A player must be able to play against another player, but it should also be possible to propose a tournament. This tournament will consist of multiple players who can take turns playing against each other. You have flexibility in how you implement the tournament, but it must clearly display who is playing against whom and the order of the players. There must be a matchmaking system: the tournament system organize the matchmaking of the participants, and announce the next fight.
- All players must adhere to the same rules, which includes having identical paddle speed.
- Each user has a Match History including 1v1 games, dates, and relevant details, accessible to logged-in users.

*** USER ***
- oyun oynamak isteyen logine gitsin

*** Security ***
- Your website must be protected against SQL injections/XSS

*** Docker ***
- If you have a backend or any other features, it is mandatory to enable an HTTPS connection for all aspects (Utilize wss instead of ws...).
- For obvious security reasons, any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git. Publicly stored credentials will lead you directly to a failure of the project.



*** hesap ***
1	- django ✅
0.5	- bootstrap ✅
0.5	- postgre ✅
1	- user management
> Users can view their online status.

> User profiles display stats, such as wins and losses.
> Each user has a Match History including 1v1 games, dates, and relevant details, accessible to logged-in users.

1	- 42 api
> 20 ekimde tamamlamış olacağım inşallah by maygen
1 - zombie game
>
1	- JWT 2FA
> JWT tamamlandı, 2FA yapılacak
1	- microservice ✅
1	- 3D ✅


*** yapmasak da olur sanki ama kolay ***
0.5	- game customization
1	- ai opponent ? saydırabilirsek iyi ✅
0.5	- support on devices ✅
0.5	- farklı browserlar ✅