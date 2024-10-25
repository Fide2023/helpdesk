# Helpdesk

This project is using node.js so therefor you must install Node JS, you can do this at https://nodejs.org/en

To reach the database for adjustments and fetching you can use MariaDB:

Follow the guide and configure the ticket.json file according to your user. https://mariadb.com/get-started-with-mariadb/:

in config/db/ticket.json make neccesary changes to fit your MariaDB user:

- host
- user
- password

In config/email.json you have to configure the settings for the email functions to work:

- service mail
- user
- password

Create an account on https://auth0.com/docs/get-started and follow their guide how to setup the server.

In config/auth0.json you have to configure the settings for the login functions to work connected to the accounts you just made:

- secret (64 character long random string)
- clientID
- issuerBaseURl

Before you can install any packages you have to initiate the `package.json`:
Do this by going to the project folder and typing `npm init` in the terminal.

The following npm packages must be installed for the code to work:

- express
- jsonwebtoken
- multer
- express-openid-connect
- nodemailer
- node-cron
- promise-mysql
- ejs

To install these, simply go into the project folder and do the following in the terminal for every package:

```bash
npm install "package name"  # example: npm install express
```
To run the code, you have to go to the project folder and type `node index.js` in the terminal.

The system should now be fully operationabal. To create a Super Admin for the server, login with the wanted account and close the server.

move to ticket/sql in the terminal and enter the database using mariadb. Inside the database you can manually change the role of the created account by doing the following:

```bash
select * from user; #locate the user id of your user and copy it

update user set role = "super_admin" where user.id = "<user_id here>";
```

Now you have your Super Admin and everything is ready to use.
