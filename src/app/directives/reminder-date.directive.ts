import { Directive, HostBinding, Input } from "@angular/core";

import { isDateGreaterThanToday } from "../utils/date-utils";

@Directive({
  selector: '[appReminderDate]',
  standalone: true
})
export class ReminderDateDirective {
  @Input({ required: true }) reminderDate: string | undefined;
  @HostBinding('style.text-decoration') get style() { return isDateGreaterThanToday(this.reminderDate as string) ? '' : 'line-through'; }
}
