This project was made with NodeJS MVC structure and database using MongoDB

This website has 2 authenticated portal:
First portal is made for normal user. After they are logged in, they will automatically redirected to the authenticated portal. This portal has 2 additional menu in dropdown on top-right. Profile menu shows user's profile data, change password, biodata, and history of game played. User can update their profile data, password, and biodata in this page. To make history game data, user must play the game in the homepage. The history will be recorded only if user play at least one game and then click back button.

Second portal is made for super user, I called it 'admin master'. You can logged in as user master with email: 'admin@admin.com' and password: 'password'. Admin master will be redirected to the dashboard portal. From this dashboard, admin can see all the users data, create data, update data, and delete data.

This project was made with three collections. The primary collection is users collection. It stores all users profile data. The second and third collection is biodata and game history. Both collections has relation with the primary collection by 'idUser' that linked to the '_id' of primary collection.
