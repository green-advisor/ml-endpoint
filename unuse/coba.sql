-- Active: 1685591341440@@127.0.0.1@3306@notifikasi

show TABLES;

INSERT INTO
    notification(
        title,
        detail,
        create_at,
        user_id
    ) VALUE (
        'contoh promo miftakhul',
        'detail promo miftakhul',
        CURRENT_TIMESTAMP(),
        'Miftakhul'
    );

INSERT INTO
    notification(
        title,
        detail,
        create_at,
        user_id
    ) VALUE (
        'contoh promo',
        'detail promo',
        CURRENT_TIMESTAMP(),
        NULL
    );

SELECT *
FROM notification
WHERE (
        user_id = 'Eko'
        OR user_id IS NULL
    )
ORDER BY create_at ASC;

CREATE Table
    category(
        id VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        PRIMARY KEY(id)
    ) engine InnoDB;

SHOW TABLES;

ALTER Table notification add COLUMN category_id VARCHAR(100);

DESCRIBE notification;

ALTER TABLE notification
ADD
    CONSTRAINT fk_notification_category FOREIGN key (category_id) REFERENCES category (id);

DESCRIBE notification;

INSERT INTO category(id, name) VALUES ('PROMO', 'Nama promo');

INSERT INTO category(id, name) VALUES ('DISKON', 'Nama diskon');

SELECT * FROM notification;

UPDATE notification set category_id = 'diskon' WHERE id = 1;

UPDATE notification set category_id = 'diskon' WHERE id = 3;

UPDATE notification set category_id = 'promo' WHERE id = 2;

UPDATE notification set category_id = 'promo' WHERE id = 4;

SELECT * FROM category;


SELECT * from notification n JOIN category c ON (n.category_id = c.id ) WHERE (n.user_id = 'eko' OR n.user_id is NULL) AND c.ID = 'DISKON' ORDER BY n.create_at DESC;

SELECT * from notification n JOIN category c ON (n.category_id = c.id ) WHERE (n.user_id = 'eko' OR n.user_id is NULL) ORDER BY n.create_at DESC;