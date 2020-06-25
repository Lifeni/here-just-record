-- Up
CREATE UNIQUE INDEX PostTextIndex ON Text (post);

CREATE UNIQUE INDEX PostFileIndex ON File (post);

CREATE INDEX PostScriptIndex ON PostScript (post);

-- Down
DROP INDEX PostTextIndex;

DROP INDEX PostFileIndex;

DROP INDEX PostScriptIndex;