DROP PROCEDURE IF EXISTS show_all_tickets_user;
DROP PROCEDURE IF EXISTS show_all_tickets_agent;
DROP PROCEDURE IF EXISTS show_ticket;
DROP PROCEDURE IF EXISTS create_ticket;
DROP PROCEDURE IF EXISTS filter_tickets;
DROP PROCEDURE IF EXISTS filter_tickets_agent;
DROP PROCEDURE IF EXISTS highest_ticket_id;
DROP PROCEDURE IF EXISTS upload_path;
DROP PROCEDURE IF EXISTS get_paths;
DROP PROCEDURE IF EXISTS update_ticket;
DROP PROCEDURE IF EXISTS insert_user;
DROP PROCEDURE IF EXISTS get_user;
DROP PROCEDURE IF EXISTS get_users;
DROP PROCEDURE IF EXISTS update_role;
DROP PROCEDURE IF EXISTS get_categories;
DROP PROCEDURE IF EXISTS add_category;
DROP PROCEDURE IF EXISTS claim_ticket;
DROP PROCEDURE IF EXISTS unclaim_ticket;
DROP PROCEDURE IF EXISTS comment_ticket;
DROP PROCEDURE IF EXISTS get_comments;
DROP PROCEDURE IF EXISTS get_agents;
DROP PROCEDURE IF EXISTS show_ticket_respons;
DROP PROCEDURE IF EXISTS get_super_admin;
DROP PROCEDURE IF EXISTS get_agents_tickets;
DROP PROCEDURE IF EXISTS post_knowledge;
DROP PROCEDURE IF EXISTS get_all_posts;
DROP PROCEDURE IF EXISTS filter_all_posts;
DROP PROCEDURE IF EXISTS get_one_post;

DELIMITER ;;

CREATE PROCEDURE create_ticket (
    IN description TEXT,
    IN category char(20),
    IN title VARCHAR(50),
    IN user VARCHAR(50)
)
BEGIN
    INSERT INTO ticket (description, category, title, user)
        VALUES (description, category, title, user);
END;;


CREATE PROCEDURE show_all_tickets_user (
    IN in_user VARCHAR(50)
)
BEGIN
SELECT
    id,
    title,
    user,
    category,
    description,
    status,
    agent,
    DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
    DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
        FROM ticket
            WHERE user = in_user
                ORDER BY COALESCE(last_update, created) DESC;
END;;

CREATE PROCEDURE show_all_tickets_agent (

)
BEGIN
    SELECT
        id,
        title,
        user,
        category,
        description,
        status,
        agent,
        DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
        DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
    FROM ticket
    ORDER BY 
        COALESCE(last_update, created) DESC;
END;;



CREATE PROCEDURE show_ticket (
    IN ticket_id INT
)
BEGIN
    SELECT
        id,
        title,
        user,
        category,
        description,
        status,
        agent,
        DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
        DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
            FROM ticket
                WHERE id = ticket_id;
END;;

CREATE PROCEDURE filter_tickets (
    IN ticket_description TEXT,
    IN ticket_status CHAR(6),
    IN ticket_category VARCHAR(50),
    IN ticket_agent VARCHAR(50),
    IN in_user VARCHAR(50)
)
BEGIN
    SELECT
        id,
        title,
        user,
        category,
        description,
        status,
        agent,
        DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
        DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
            FROM ticket
                WHERE user = in_user 
                AND status LIKE CONCAT('%', ticket_status, '%') 
                AND description LIKE CONCAT('%', ticket_description, '%')
                AND category LIKE CONCAT('%', ticket_category, '%')
                AND agent LIKE CONCAT('%', ticket_agent, '%')
                    ORDER BY 
                        COALESCE(last_update, created) DESC;
END;;

CREATE PROCEDURE filter_tickets_agent (
    IN ticket_description TEXT,
    IN ticket_status CHAR(6),
    IN ticket_category VARCHAR(20),
    IN ticket_agent VARCHAR(50)
)
BEGIN
    SELECT
        id,
        title,
        user,
        category,
        description,
        status,
        agent,
        DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
        DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
            FROM ticket
                WHERE status LIKE CONCAT('%', ticket_status, '%') 
                AND description LIKE CONCAT('%', ticket_description, '%')
                AND category LIKE CONCAT('%', ticket_category, '%')
                AND agent LIKE CONCAT('%', ticket_agent, '%')
                    ORDER BY 
                        COALESCE(last_update, created) DESC;
END;;

CREATE PROCEDURE upload_path (
    IN ticket_id INT,
    IN file_path VARCHAR(255),
    IN file_name VARCHAR(255)
)
BEGIN
    INSERT INTO upload (ticket_id, path, filename)
        VALUES(ticket_id, file_path, file_name);
END;;

CREATE PROCEDURE highest_ticket_id ( 
)
BEGIN
    SELECT id 
        FROM ticket 
        ORDER BY id DESC LIMIT 1;
END;;

CREATE PROCEDURE get_paths (
    IN tick_id INT
)
BEGIN
    SELECT * from upload
            WHERE ticket_id = tick_id;
END;;

CREATE PROCEDURE update_ticket (
    IN ticket_id INT,
    IN ticket_status char(6),
    IN ticket_category  VARCHAR(20)
)
BEGIN
    UPDATE ticket
        SET 
        status = ticket_status,
        category = ticket_category
            WHERE id = ticket_id;
END;;


CREATE PROCEDURE insert_user (
    IN in_user_id VARCHAR(255),
    IN in_name VARCHAR(255),
    IN in_email VARCHAR(255),
    IN in_picture VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user WHERE user_id = in_user_id) THEN
        INSERT INTO user (user_id, name, email, picture)
            VALUES (in_user_id, in_name, in_email, in_picture);
    END IF;
END;;


CREATE PROCEDURE get_user (
    IN in_user_id VARCHAR(255)
)
BEGIN
    SELECT 
        *
        from user
            WHERE in_user_id = user_id;
END;;

CREATE PROCEDURE get_users (
)
BEGIN
    SELECT *
        from user
            WHERE role != "super_admin";
END;;

CREATE PROCEDURE update_role (
    IN in_user_id VARCHAR(255),
    IN in_role VARCHAR(255)
)
BEGIN
    UPDATE user
        SET 
        role = in_role
            WHERE user_id = in_user_id;
END;;

CREATE PROCEDURE get_categories (
)
BEGIN
    SELECT *
        from category;
END;;

CREATE PROCEDURE add_category (
    IN add_category VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM category WHERE category = add_category) THEN
        INSERT INTO category (category)
            VALUES (add_category);
    END IF;
END;;

CREATE PROCEDURE claim_ticket (
    IN ticket_id INT,
    IN in_agent VARCHAR(50)
)
BEGIN
    IF (SELECT agent FROM TICKET WHERE id = ticket_id) = 'unclaimed' THEN
    UPDATE ticket
        SET agent = in_agent
            WHERE id = ticket_id;
    END IF;
END;;

CREATE PROCEDURE unclaim_ticket (
    IN ticket_id INT
)
BEGIN
    IF (SELECT agent FROM TICKET WHERE id = ticket_id) != 'unclaimed' THEN
    UPDATE ticket
        SET agent = "unclaimed"
            WHERE id = ticket_id;
    END IF;
END;;

CREATE PROCEDURE comment_ticket (
    IN in_ticket_id INT,
    IN in_comment VARCHAR(255),
    IN in_user VARCHAR(255)
)
BEGIN
    INSERT INTO comment (ticket_id, comment, user)
        VALUES(in_ticket_id, in_comment, in_user);

    UPDATE ticket
        SET 
            last_update = CURRENT_TIMESTAMP
    WHERE id = in_ticket_id;
    
END;;

CREATE PROCEDURE get_comments (
    IN in_ticket_id INT
)
BEGIN
    SELECT 
    ticket_id,
    comment,
    user,
    DATE_FORMAT(commented_time, '%Y-%m-%d %H:%i:%s') AS commented_timestamp
        FROM comment
            WHERE ticket_id = in_ticket_id;
END;;


CREATE PROCEDURE get_agents (
)
BEGIN
    SELECT *
        from user
            WHERE role = "agent";
END;;

CREATE PROCEDURE show_ticket_respons (
)
BEGIN
    SELECT
        id,
        title,
        user,
        category,
        description,
        status,
        agent,
        DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
        DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
            FROM ticket
                WHERE 
                    status = 'open'
                    AND (last_update IS NULL AND created <= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))
                    OR  (last_update IS NOT NULL AND last_update <= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR));
END;;

CREATE PROCEDURE get_super_admin (
)
BEGIN
    SELECT 
        *
        from user
            WHERE role = "super_admin";
END;;

CREATE PROCEDURE get_agents_tickets (
    IN in_agent VARCHAR(50)
)
BEGIN
SELECT
    id,
    title,
    user,
    category,
    description,
    status,
    agent,
    DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp,
    DATE_FORMAT(last_update, '%Y-%m-%d %H:%i:%s') AS formatted_updatestamp
        FROM ticket
            WHERE agent = in_agent
                ORDER BY COALESCE(last_update, created) DESC;
END;;

CREATE PROCEDURE post_knowledge (
    IN in_ticket_id INT,
    IN in_problem TEXT,
    IN in_solution TEXT,
    IN in_agent VARCHAR(50)
)
BEGIN
    INSERT INTO knowledge (ticket_id, problem, solution, agent)
        VALUES(in_ticket_id, in_problem, in_solution, in_agent);
END;;

CREATE PROCEDURE get_all_posts (
)
BEGIN
    SELECT 
        k.id,
        k.ticket_id,
        k.problem,
        k.solution,
        k.agent,
        t.category,
        DATE_FORMAT(posted_time, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp
            FROM knowledge AS k
                JOIN ticket AS t
                    ON k.ticket_id = t.id
                        ORDER BY posted_time DESC;
END;;


CREATE PROCEDURE filter_all_posts (
    IN in_category VARCHAR(50)
)
BEGIN
    SELECT
        k.id,
        k.ticket_id,
        k.problem,
        k.solution,
        k.agent,
        t.category,
        DATE_FORMAT(posted_time, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp
            FROM knowledge AS k
                JOIN ticket AS t
                    ON k.ticket_id = t.id
                WHERE t.category = in_category
                        ORDER BY posted_time DESC;
END;;

CREATE PROCEDURE get_one_post (
    IN in_post_id INT
)
BEGIN
    SELECT 
        k.id,
        k.ticket_id,
        k.problem,
        k.solution,
        k.agent,
        t.category,
        DATE_FORMAT(posted_time, '%Y-%m-%d %H:%i:%s') AS formatted_timestamp
            FROM knowledge AS k
                JOIN ticket AS t
                    ON k.ticket_id = t.id
                WHERE k.id = in_post_id;
END;;

DELIMITER ;
