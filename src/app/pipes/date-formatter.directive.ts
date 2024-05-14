import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { dateToIsoString, isSameYear, isToday, isTomorrow, isYesterday } from "../utils/date-utils";

@Pipe({
  name: 'appDatePipe',
  standalone: true
})
export class DateFormatterPipe implements PipeTransform {

  constructor(private translateSerivce: TranslateService) { }

  transform(value: string | undefined, format: string) {
    if (value) {
      if (format === 'long') {
        return this.long(value);
      } else if (format === 'short') {
        return this.short(value);
      }
      else {
        return this.long(value);
      }
    } else {
      return "";
    }
  }

  public short(value: string): string {
    const date = new Date(dateToIsoString(new Date(value as string)));
    const languageCode = this.translateSerivce.currentLang;
    const datePipe = new DatePipe(this.translateSerivce.currentLang);
    if (isToday(date)) {
      if (languageCode == 'en') {
        return datePipe.transform(dateToIsoString(new Date(value as string)), ' h:mm aaa')!;
      } else {
        return datePipe.transform(dateToIsoString(new Date(value as string)), ' H:mm')!;
      }
    }
    else {
      const year = isSameYear(date) ? '' : ' y';
      if (languageCode == 'en') {
        return datePipe.transform(dateToIsoString(new Date(value as string)), `MMM d${year}`)!;
      } else {
        return datePipe.transform(dateToIsoString(new Date(value as string)), `d MMM${year}`)!;
      }
    }
  }

  public long(value: string) {
    const date = new Date(dateToIsoString(new Date(value as string)));
    const languageCode = this.translateSerivce.currentLang;
    const datePipe = new DatePipe(this.translateSerivce.currentLang);
    let resultDate: string | undefined = undefined;
    if (isYesterday(date)) {
      resultDate = this.translateSerivce.instant("yesterday");
    }
    else if (isToday(date)) {
      resultDate = this.translateSerivce.instant("today");
    }
    else if (isTomorrow(date)) {
      resultDate = this.translateSerivce.instant("tomorrow");
    }
    if (resultDate) {
      if (languageCode == 'en') {
        return resultDate + datePipe.transform(dateToIsoString(new Date(value as string)), ' h:mm aaa')
      } else {
        return resultDate + datePipe.transform(dateToIsoString(new Date(value as string)), ' H:mm');
      }
    } else {
      const year = isSameYear(date) ? '' : ' y';
      if (languageCode == 'en') {
        return datePipe.transform(dateToIsoString(new Date(value as string)), `MMM d${year}, h:mm aaa`)
      } else {
        return datePipe.transform(dateToIsoString(new Date(value as string)), `d MMM${year}, H:mm`);
      }
    }
  }

}
