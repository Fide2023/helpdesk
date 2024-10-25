# Helpdesk

To reach the database for adjustments and fetching you can use MariaDB:

https://mariadb.com/get-started-with-mariadb/:
Follow the guide and configure the ticket.json file according to your user.


First, you have to initiate the `package.json`:
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
