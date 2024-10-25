const express = require("express");
const router = express.Router();
const accounts = require("../src/ticket.js");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Buffer.from(file.originalname, 'latin1').toString('utf8')); // Preserve original filename with special characters
    }
  });

const upload = multer({ storage: storage, limits: { files:4}});
router.use(express.urlencoded({ extended: true }));
router.use('/uploads', express.static('uploads'));
const config = require("../config/auth0.json");
const emailConfig = require("../config/email.json");

config.afterCallback = async (req, res, session) => {
if (session && session.id_token) {
    const decodedToken = jwt.decode(session.id_token);

    const user = decodedToken;
    if (user) {
    await accounts.insertUser(user.sub, user.name, user.email, user.picture);
    }
} else {
    console.error("No id_token found in session.");
}

return session;
};

router.use(auth(config));


async function notifySuperAdminAboutUnrespondedTickets() {
    const tickets = await accounts.getTicketsRespons();

    let transporter = nodemailer.createTransport(emailConfig);

    if (tickets.length > 0) {
        const superAdmin = await accounts.getSuperAdmin();
        const superAdminEmail = superAdmin[0].email;

        let changes = tickets.map(ticket => `Ticket #${ticket.id} - user: ${ticket.user}`).join('\n\n');

        let mailOptions = {
            from: emailConfig.auth.user,
            to: superAdminEmail,
            subject: `Tickets Pending Response for More Than 3 Days`,
            text: `Hello Super Admin,

The following tickets have not received a response in 3 days or more:

${changes}

Please look into these tickets.

Regards,
Ticket helpdesk`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};

cron.schedule('0 0 * * *', async () => {
    await notifySuperAdminAboutUnrespondedTickets();
});

function sendEmailNotification(userEmail, ticket, changes) {
    let transporter = nodemailer.createTransport(emailConfig);

    let mailOptions = {
      from: emailConfig.auth.user,
      to: userEmail,
      subject: `Ticket #${ticket.id} Updated`,
      text: `Hello,
  
  The following changes were made to your ticket:
  
  ${changes}
  
  You can view your ticket at: http://localhost:1337/listing/${ticket.id}
  
  Regards,
  Ticket helpdesk`,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
router.get('/', async (req, res) => {
    let data = {};
    data.loggedIn = req.oidc.isAuthenticated();
    if (data.loggedIn) {
        data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    }
    data.title = "Start";
    res.render("pages/start.ejs", data);;
});

router.get("/create",requiresAuth(), async (req, res) => {
    let data = {};
    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    data.title = "Create";
    data.category = await accounts.getCategories();
    data.fileSize = require("../config/fileSize.json");
    res.render("pages/ticket.ejs", data);
});

router.get("/knowledge",requiresAuth(), async (req, res) => {
    let data = {};
    data.loggedIn = req.oidc.isAuthenticated();
    data.title = "Knowledge";
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    if (data.user.role == "agent" || data.user.role =="super_admin") {
        data.tickets = await accounts.getAgentsTickets(data.user.name);
        data.category = await accounts.getCategories();
        data.knowledge_posts = await accounts.getAllPosts();
        data.selected_category = null;
        res.render("pages/knowledge.ejs", data);
    } else {
        res.redirect("/");
    }
});

router.get("/knowledge/filter",requiresAuth(), async (req, res) => {
    let data = {};
    data.loggedIn = req.oidc.isAuthenticated();
    data.title = "Knowledge";
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    if (data.user.role == "agent" || data.user.role == "super_admin") {
        data.tickets = await accounts.getAgentsTickets(data.user.name);
        data.category = await accounts.getCategories();
        if (req.query.category != "") {
            data.knowledge_posts = await accounts.filterAllPosts(req.query.category);
        } else {
            data.knowledge_posts = await accounts.getAllPosts();
        }
        data.selected_category = req.query.category;
        res.render("pages/knowledge.ejs", data);
    } else {
        res.redirect("/");
    }
});

router.get("/knowledge/:id",requiresAuth(), async (req, res) => {
    let data = {};
    data.loggedIn = req.oidc.isAuthenticated();
    data.title = "Knowledge";
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    if (data.user.role == "agent" || data.user.role == "super_admin") {
        data.post = await accounts.getOnePost(req.params.id);
        res.render("pages/post.ejs", data);
    } else {
        res.redirect("/");
    }
});

router.get("/listing",requiresAuth(), async (req, res) => {
    let data = {};

    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    data.title = "Listing";
    if (data.user.role == "user") {
        data.tickets = await accounts.showTicketsUser(data.user.name);
    } else {
        data.tickets = await accounts.showTicketsAgent();
    }
    data.category = await accounts.getCategories();
    data.agent = await accounts.getAgents();
    res.render("pages/listing.ejs", data);
});

router.get("/listing/filter",requiresAuth(), async (req, res) => {
    let data = {};

    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    data.title = "Filter ticket";
    if (data.user.role == "user") {
        data.tickets = await accounts.filterTickets(req.query.description, req.query.status, req.query.category, req.query.agent, data.user.name);
    } else {
        data.tickets = await accounts.filterTicketsAgent(req.query.description, req.query.status, req.query.category, req.query.agent);
    }
    data.query = req.query;
    data.category = await accounts.getCategories();
    data.agent = await accounts.getAgents();
    res.render("pages/listing_filter.ejs",data);
});

router.get("/listing/:id",requiresAuth(), async (req, res) => {
    let data = {};

    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    data.title = "Listing";
    data.ticket = await accounts.showTicket(req.params.id);
    if (!data.ticket[0] || data.ticket[0].lenght === 0) {
        return res.redirect("/listing");
    }
    if (data.user.role === "user" && data.ticket[0].user !== data.user.name) {
        return res.redirect("/listing");
    }
    data.paths = await accounts.uploadsInformation(req.params.id);
    data.category = await accounts.getCategories();
    data.comments = await accounts.getComments(req.params.id);
    res.render("pages/listing_ticket.ejs", data);
});

router.get("/admin",requiresAuth(), async (req, res) => {
    let data = {};

    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    if (data.user.role == "super_admin") {
        data.title = "Admin";
        data.users = await accounts.getUsers();
        res.render("pages/user_assignment.ejs",data);
    } else {
        res.redirect("/");
    }
});

router.get("/category",requiresAuth(), async (req, res) => {
    let data = {};

    data.loggedIn = req.oidc.isAuthenticated();
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    if (data.user.role == "agent" || data.user.role == "super_admin") {
        data.title = "Category";
        data.category = await accounts.getCategories();
        res.render("pages/category.ejs", data);
    } else {
        res.redirect("/");
    }
});

router.post("/category", async (req, res) => {

    await accounts.addCategory(req.body.new_category);
    res.redirect(`/category`);
});

router.post("/updateRole", async (req, res) => {

    await accounts.updateRole(req.body.user_id, req.body.role);
    res.redirect(`/admin`);
}); 

router.post("/listing/update", async (req, res) => {

    let changes = [];

    const ticket = await accounts.showTicket(req.body.id);

    await accounts.updateTicket(req.body.id, req.body.status, req.body.category);

    if (ticket[0].category !== req.body.category) {
        changes.push(`Category changed from ${ticket[0].category} to ${req.body.category}`);
    }
    if (ticket[0].status !== req.body.status) {
        changes.push(`Status changed from ${ticket[0].status} to ${req.body.status}`);
    }
    if (changes.length > 0) {
        sendEmailNotification(ticket[0].user, ticket[0], changes.join('\n'));
    }
    res.redirect(`/listing/${req.body.id}`);
}); 

router.post("/listing/claim", async (req, res) => {

    let changes = `Ticket was claimed by agent ${req.body.agent}`;
    const ticket = await accounts.showTicket(req.body.id);

    await accounts.claimTicket(req.body.id, req.body.agent);

    sendEmailNotification(ticket[0].user, ticket[0], changes)
    res.redirect(`/listing/${req.body.id}`);
}); 

router.post("/listing/unclaim", async (req, res) => {

    let changes = `Ticket was unclaimed by agent ${req.body.agent}`;
    const ticket = await accounts.showTicket(req.body.id);

    await accounts.unclaimTicket(req.body.id);

    sendEmailNotification(ticket[0].user, ticket[0], changes)
    res.redirect(`/listing/${req.body.id}`);
}); 

router.post("/listing/comment", async (req, res) => {

    let data = {};
    const ticket = await accounts.showTicket(req.body.id);
    data.user = (await accounts.getUser(req.oidc.user.sub))[0];
    await accounts.commentTicket(req.body.id, req.body.comment, data.user.name);
    if (ticket[0].user !== data.user.email) {
        let changes = `${data.user.name} commented on your ticket.

Comment: ${req.body.comment}`;
        sendEmailNotification(ticket[0].user, ticket[0], changes);
    }
    res.redirect(`/listing/${req.body.id}`);
}); 

router.post('/create', upload.array('images', 10), async (req, res) => {

    const files = req.files;
    const user = req.oidc.user.email;
    await accounts.createTicket(req.body.description, req.body.category,req.body.title,user)
    const ticketID = await accounts.highestId();

    for (const file of files) {
        const filePath = file.path;
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // Correct the file name encoding
        
        await accounts.uploadPath(ticketID[0].id, filePath, fileName);
    }

    res.redirect("/?success=true");
});

router.post("/knowledge/post", async (req, res) => {

    await accounts.postKnowledge(req.body.id, req.body.issue, req.body.solution, req.body.agent);
    res.redirect(`/knowledge`);
}); 


router.use((err, req, res, next) => {
    if (err.message && err.message.includes("Cannot read property 'role' of undefined")) {
        return res.redirect('/logout');
    }
    next(err);
});

module.exports = router;
