CREATE TABLE if not exists `emails` (
  `id`  INTEGER PRIMARY KEY AUTOINCREMENT,
  `to`  TEXT,
  `from`  TEXT,
  `uid`  TEXT,
  `mailbox`  TEXT,
  `subject` TEXT,
  `date`  TEXT,
  `seen`  TEXT
);