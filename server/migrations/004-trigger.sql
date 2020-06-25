-- Up
CREATE TRIGGER DeletePost BEFORE DELETE ON Post BEGIN
DELETE FROM
    Text
WHERE
    post = old.id;

DELETE FROM
    File
WHERE
    post = old.id;

END;

CREATE TRIGGER DeleteTag BEFORE DELETE ON Tag BEGIN
UPDATE
    Post
SET
    tag = 0
WHERE
    tag = old.id;

END;

-- Down
DROP TRIGGER DeletePost;

DROP TRIGGER DeleteTag;