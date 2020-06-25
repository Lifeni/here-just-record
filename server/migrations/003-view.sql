-- Up
CREATE VIEW TextList (
    id,
    post,
    date,
    like,
    content
) AS
SELECT
    Text.id,
    Post.id,
    Post.date,
    Post.like,
    Text.content
FROM
    Post,
    Text
WHERE
    Post.id = Text.post;

CREATE VIEW FileList (
    id,
    post,
    date,
    like,
    type,
    url
) AS
SELECT
    File.id,
    Post.id,
    Post.date,
    Post.like,
    File.type,
    File.url
FROM
    Post,
    File
WHERE
    Post.id = File.post;

CREATE VIEW TagList (
    id,
    name,
    description,
    post
) AS
SELECT
    Tag.id,
    Tag.name,
    Tag.description,
    Post.id
FROM
    Tag,
    Post
WHERE
    Post.tag = Tag.id;

-- Down
DROP VIEW WholePost;

DROP VIEW FileList;

DROP VIEW TagList;