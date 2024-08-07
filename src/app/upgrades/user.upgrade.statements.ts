export class UserUpgradeStatements {
  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS note(
          id INTEGER PRIMARY KEY,
          title TEXT,
          value TEXT,
          creation_date TEXT,
          last_modified_date TEXT,
          deleted_date TEXT,
          archived INTEGER,
          deleted INTEGER,
          pinned INTEGER,
          background TEXT,
          category_id INTEGER,
          FOREIGN KEY (category_id) REFERENCES note_category(id) ON DELETE SET NULL
          );`,
        `CREATE TABLE IF NOT EXISTS note_setting(
          id INTEGER PRIMARY KEY,
          view_mode TEXT,
          sort_mode TEXT,
          sort_direction TEXT
          );`,
        `CREATE TABLE IF NOT EXISTS note_category(
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL UNIQUE
          );`,
        `CREATE TABLE IF NOT EXISTS note_reminder(
          id INTEGER PRIMARY KEY,
          date TEXT NOT NULL,
          repeat INTEGER,
          every TEXT,
          note_id INTEGER,
          FOREIGN KEY (note_id) REFERENCES note(id) ON DELETE CASCADE
          );`,
        `CREATE TABLE IF NOT EXISTS setting(
          id INTEGER PRIMARY KEY,
          theme TEXT NOT NULL,
          language TEXT NOT NULL
          );`
      ],
    },
    {
      toVersion: 2,
      statements: [
        `INSERT INTO note_setting (view_mode, sort_mode, sort_direction) VALUES('grid', 'modifiedDate', 'ascending');`,
        `INSERT INTO setting (theme, language) VALUES('system-default', 'system-default');`
      ]
    }
  ]
}
