import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
} from '@angular/core';

import { GestureController } from '@ionic/angular';
import {
  Subject,
  race,
  switchMap,
  timer,
} from 'rxjs';

@Directive({
  selector: '[appLongPress]',
  standalone: true,
})
export class LongPressDirective implements AfterViewInit {
  @Output() tap = new EventEmitter();
  @Output() press = new EventEmitter();
  @Input('delay') delay = 500;

  private fingerDown = new Subject<void>();
  private fingerUp = new Subject<boolean>();

  private positions = {
    start: {
      x: undefined! as number,
      y: undefined! as number,
    },
    current: {
      x: undefined! as number,
      y: undefined! as number,
    },
  };

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private zone: NgZone) { }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
    this.handleFingerBehaviour();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: (ev) => {
        this.fingerDown.next();

        this.positions = {
          start: { x: ev.startX, y: ev.startY },
          current: { x: ev.currentX, y: ev.currentY },
        };
      },
      onMove: (ev) => {
        this.positions.current = { x: ev.currentX, y: ev.currentY };
      },
      onEnd: () => this.fingerUp.next(true),
    });
    gesture.enable(true);
  }

  private handleFingerBehaviour(): void {
    this.fingerDown
      .pipe(
        switchMap(() => race(this.fingerUp.asObservable(), timer(this.delay)))
      )
      .subscribe((res) => {
        this.zone.run(() => {
        if (res) {
          this.tap.emit();
        } else {
          this.press.emit();
        }
      });
      });
  }
}
