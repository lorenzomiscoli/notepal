import { LocalNotifications } from "@capacitor/local-notifications";
import { from, of, switchMap } from "rxjs";

import { Note, ScheduleEvery } from "../interfaces/note.interface";
import { dateToIsoString, isDateGreaterThanToday } from "./date-utils";

export var addNotification = (notes: Note[]) => {
  const notificationsToSchedule = notes.filter((note) => isDateGreaterThanToday(note.reminderDate as string))
    .map(note => {
      return {
        title: note.title,
        body: note.value,
        id: note.id,
        schedule: {
          at: new Date(dateToIsoString(new Date(note.reminderDate as string))),
          repeats: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? false : true,
          every: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? undefined : note.reminderEvery
        }
      }
    });
  return from(LocalNotifications.schedule({ notifications: notificationsToSchedule }))
}

export var cancelNotification = (notesIds: number[]) => {
  return from(LocalNotifications.getPending()).pipe(switchMap((results) => {
    const notificationToDelete = results.notifications.filter(notification => notesIds.includes(notification.id))
    if (notificationToDelete.length > 0) {
      return LocalNotifications.cancel({ notifications: notificationToDelete })
    } else {
      return of(undefined);
    }
  }));
}
