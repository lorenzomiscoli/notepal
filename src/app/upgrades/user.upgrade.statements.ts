export class UserUpgradeStatements {
  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS note(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          value TEXT,
          date TEXT
          );`
      ]
    }
  ]
}
