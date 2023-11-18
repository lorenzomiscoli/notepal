import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { DbnameVersionService } from './dbname-version.service';
import { SQLiteService } from './sqlite.service';
import { UserUpgradeStatements } from '../upgrades/user.upgrade.statements';

@Injectable({
  providedIn: "root"
})
export class StorageService {
  private databaseName: string = "";
  private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
  private versionUpgrades;
  private loadToVersion;
  public db!: SQLiteDBConnection;

  constructor(private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService) {
    this.versionUpgrades = this.uUpdStmts.userUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  public async initializeDatabase(dbName: string): Promise<void> {
    this.databaseName = dbName;
    // create upgrade statements
    await this.sqliteService.addUpgradeStatement({ database: this.databaseName, upgrade: this.versionUpgrades });
    // create and/or open the database
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );
    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

}
