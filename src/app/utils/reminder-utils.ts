import { LocalNotifications } from "@capacitor/local-notifications";
import { from, of, switchMap } from "rxjs";

import { Note, ScheduleEvery } from "../interfaces/note.interface";
import { dateToIsoString } from "./date-utils";

export var addNotification = (note: Note) => {
  return from(LocalNotifications.schedule({
    notifications: [
      {
        title: note.title,
        body: note.value,
        id: note.id,
        schedule: {
          at: new Date(dateToIsoString(new Date(note.reminderDate as string))),
          repeats: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? false : true,
          every: note.reminderEvery === ScheduleEvery.NO_SCHEDULE ? undefined : note.reminderEvery
        }
      },
    ],
  }))
}

export var cancelNotification = (noteId: number) => {
  return from(LocalNotifications.getPending()).pipe(switchMap((results) => {
    let notificationToDelete = results.notifications.filter(notification => notification.id === noteId);
    if (notificationToDelete.length > 0) {
      return LocalNotifications.cancel({
        notifications: [
          {
            id: notificationToDelete[0].id
          }
        ]
      })
    } else {
      return of(undefined);
    }
  }));
}
