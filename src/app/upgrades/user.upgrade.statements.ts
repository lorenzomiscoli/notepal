export class UserUpgradeStatements {
  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS note(
          id INTEGER PRIMARY KEY,
          title TEXT,
          value TEXT,
          date TEXT,
          archived INTEGER
          );`,
        `CREATE TABLE IF NOT EXISTS note_setting(
          id INTEGER PRIMARY KEY,
          view_mode TEXT,
          sort_mode TEXT
          );`
      ],
    },
    {
      toVersion: 2,
      statements: [
        `INSERT INTO note_setting (view_mode, sort_mode) VALUES('grid', 'modifiedDate');`
      ]
    }
  ]
}
