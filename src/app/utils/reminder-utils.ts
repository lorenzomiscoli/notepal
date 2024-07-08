import { LocalNotifications } from "@capacitor/local-notifications";
import { toDoc } from "ngx-editor";
import { from, of, switchMap } from "rxjs";

import { Note, ScheduleEvery } from "../interfaces/note.interface";
import { dateToIsoString, isDateGreaterThanToday } from "./date-utils";

export var addNotification = (notes: Note[]) => {
  const notificationsToSchedule = notes.filter((note) => isDateGreaterThanToday(note.reminderDate as string))
    .map(note => {
      return {
        title: note.title,
        body: convertValue(note.value),
        id: note.id,
        schedule: {
          at: new Date(dateToIsoString(new Date(note.reminderDate as string))),
          repeats: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? false : true,
          every: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? undefined : note.reminderEvery
        }
      }
    });
  if (notificationsToSchedule.length > 0) {
    return from(LocalNotifications.schedule({ notifications: notificationsToSchedule }));
  }
  return of(undefined);
}

export var cancelNotification = (notesIds: number[]) => {
  return from(LocalNotifications.getPending()).pipe(switchMap((results) => {
    const notificationToDelete = results.notifications.filter(notification => notesIds.includes(notification.id))
    if (notificationToDelete.length > 0) {
      return LocalNotifications.cancel({ notifications: notificationToDelete })
    }
    return of(undefined);
  }));
}

export var updateNotification = (note: Note) => {
  return from(LocalNotifications.getPending()).pipe(switchMap((results) => {
    const notificationToUpdate = results.notifications.filter(notification => note.id == notification.id)
    if (notificationToUpdate.length > 0) {
      return addNotification([note]);
    }
    return of(undefined);
  }));
}

var convertValue = (htmlValue: any) => {
  let resultString = '';
  const docValue: any = toDoc(htmlValue);
  if (docValue && docValue.content) {
    docValue.content.forEach((paragraph: any) => {
      if (paragraph.content) {
        paragraph.content.forEach((value: any) => {
          if (value.text)
            resultString += value.text;
        });
        resultString += "\n";
      }
    });
  }
  return resultString.replace(/(^[ \t]*\n)/gm, "");
}
