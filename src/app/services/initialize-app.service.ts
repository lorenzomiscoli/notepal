import { Injectable } from '@angular/core';

import { Toast } from '@capacitor/toast';

import { SQLiteService } from './sqlite.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: "root"
})
export class InitializeAppService {
  public isAppInit: boolean = false;
  public platform!: string;

  constructor(private sqliteService: SQLiteService, private storageService: StorageService) { }

  public async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {

        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }

        const DB_NAME = 'notepal';
        await this.storageService.initializeDatabase(DB_NAME);

        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.saveToStore(DB_NAME);
        }

        this.isAppInit = true;

      } catch (error) {
        await Toast.show({
          text: `initializeAppError: ${error}`,
          duration: 'long'
        });
      }
    });
  }

}
