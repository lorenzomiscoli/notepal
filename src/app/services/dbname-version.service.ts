import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DbnameVersionService {
  private _dbNameVersionDict: Map<string, number> = new Map();

  public set(dbName: string, version: number): void {
    this._dbNameVersionDict.set(dbName, version);
  }

  public getVersion(dbName: string) {
    if (this._dbNameVersionDict.has(dbName)) {
      return this._dbNameVersionDict.get(dbName);
    } else {
      return -1;
    }
  }

}
