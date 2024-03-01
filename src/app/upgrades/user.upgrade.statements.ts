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
          archived INTEGER,
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
          );`
      ],
    },
    {
      toVersion: 2,
      statements: [
        `INSERT INTO note_setting (view_mode, sort_mode, sort_direction) VALUES('grid', 'modifiedDate', 'ascending');`
      ]
    }
  ]
}
