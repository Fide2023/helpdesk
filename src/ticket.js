"use strict";

const mysql = require("promise-mysql");
const config = require("../config/db/ticket.json");

async function createTicket(description, category, title, user) {
    const db = await mysql.createConnection(config);
    let sql = `CALL create_ticket(?, ?, ?, ?);`;

    await db.query(sql, [description, category, title, user]);
    db.end();
}

async function showTicketsUser(user) {
    const db = await mysql.createConnection(config);
    let sql = `CALL show_all_tickets_user(?);`;

    let res = await db.query(sql, [user]);
    db.end();

    return res[0];
}

async function showTicketsAgent() {
    const db = await mysql.createConnection(config);
    let sql = `CALL show_all_tickets_agent();`;

    let res = await db.query(sql);
    db.end();

    return res[0];
}

async function showTicket(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL show_ticket(?);`;

    let res = await db.query(sql, [id]);
    db.end();

    return res[0];
}

async function filterTickets(description, status, category, agent, user) {
    const db = await mysql.createConnection(config);
    let sql = `CALL filter_tickets(?,?,?,?,?);`;

    let res = await db.query(sql, [description, status, category, agent, user]);
    db.end();

    return res[0];
}

async function filterTicketsAgent(description, status, category, agent) {
    const db = await mysql.createConnection(config);
    let sql = `CALL filter_tickets_agent(?,?,?,?);`;

    let res = await db.query(sql, [description, status, category, agent]);
    db.end();

    return res[0];
}

async function uploadPath(ticket_id, path, name) {
    const db = await mysql.createConnection(config);
    let sql = `CALL upload_path(?,?,?);`;

    await db.query(sql, [ticket_id, path, name]);
    db.end();
}

async function highestId() {
    const db = await mysql.createConnection(config);
    let sql = `CALL highest_ticket_id();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function uploadsInformation(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_paths(?);`;

    let res = await db.query(sql, [id]);
    db.end();
    return res[0];
}

async function updateTicket(ticket_id, ticket_status, ticket_category) {
    const db = await mysql.createConnection(config);
    let sql = `CALL update_ticket(?,?,?);`;

    await db.query(sql, [ticket_id, ticket_status, ticket_category]);
    db.end();
}

async function insertUser(user_id, name, email, picture) {
    const db = await mysql.createConnection(config);
    let sql = `CALL insert_user(?,?,?,?);`;

    await db.query(sql, [user_id, name, email, picture]);
    db.end();
}

async function getUser(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_user(?);`;

    let res = await db.query(sql, [id]);
    db.end();
    return res[0];
}

async function getUsers() {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_users();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function updateRole(user_id, role) {
    const db = await mysql.createConnection(config);
    let sql = `CALL update_role(?,?);`;

    await db.query(sql, [user_id, role]);
    db.end();
}

async function addCategory(category) {
    const db = await mysql.createConnection(config);
    let sql = `CALL add_category(?);`;

    await db.query(sql, [category]);
    db.end();
}

async function getCategories() {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_categories();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function claimTicket(id, agent) {
    const db = await mysql.createConnection(config);
    let sql = `CALL claim_ticket(?,?);`;

    await db.query(sql, [id, agent]);
    db.end();
}

async function unclaimTicket(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL unclaim_ticket(?);`;

    await db.query(sql, [id]);
    db.end();
}

async function commentTicket(id, comment, user) {
    if (comment.trim() === "") {
        return;
    }

    const db = await mysql.createConnection(config);
    let sql = `CALL comment_ticket(?,?,?);`;

    await db.query(sql, [id, comment, user]);
    db.end();
}

async function getComments(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_comments(?);`;

    let res = await db.query(sql, [id]);
    db.end();
    return res[0];
}

async function getAgents() {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_agents();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function viewTicket(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL view_ticket(?);`;

    await db.query(sql, [id]);
    db.end();
}

async function getTicketsRespons() {
    const db = await mysql.createConnection(config);
    let sql = `CALL show_ticket_respons();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function getSuperAdmin() {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_super_admin();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function getAgentsTickets(agent) {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_agents_tickets(?);`;

    let res = await db.query(sql, [agent]);
    db.end();
    return res[0];
}

async function postKnowledge(id, problem, solution, agent) {
    const db = await mysql.createConnection(config);
    let sql = `CALL post_knowledge(?,?,?,?);`;

    let res = await db.query(sql, [id, problem, solution, agent]);
    db.end();
    return res[0];
}

async function getAllPosts() {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_all_posts();`;

    let res = await db.query(sql);
    db.end();
    return res[0];
}

async function getOnePost(id) {
    const db = await mysql.createConnection(config);
    let sql = `CALL get_one_post(?);`;

    let res = await db.query(sql, [id]);
    db.end();
    return res[0];
}

async function filterAllPosts(category) {
    const db = await mysql.createConnection(config);
    let sql = `CALL filter_all_posts(?);`;

    let res = await db.query(sql, [category]);
    db.end();
    return res[0];
}

module.exports = {
    "createTicket": createTicket,
    "showTicketsUser": showTicketsUser,
    "showTicketsAgent": showTicketsAgent,
    "showTicket": showTicket,
    "filterTickets": filterTickets,
    "filterTicketsAgent": filterTicketsAgent,
    "uploadPath": uploadPath,
    "highestId": highestId,
    "uploadsInformation": uploadsInformation,
    "updateTicket": updateTicket,
    "insertUser": insertUser,
    "getUser": getUser,
    "getUsers": getUsers,
    "updateRole": updateRole,
    "addCategory": addCategory,
    "getCategories": getCategories,
    "claimTicket": claimTicket,
    "unclaimTicket": unclaimTicket,
    "commentTicket": commentTicket,
    "getComments": getComments,
    "getAgents": getAgents,
    "viewTicket": viewTicket,
    "getTicketsRespons": getTicketsRespons,
    "getSuperAdmin": getSuperAdmin,
    "getAgentsTickets": getAgentsTickets,
    "postKnowledge": postKnowledge,
    "getAllPosts": getAllPosts,
    "getOnePost": getOnePost,
    "filterAllPosts": filterAllPosts
};
