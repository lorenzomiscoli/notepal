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
import { Subject, race, take, takeUntil, timer } from 'rxjs';

@Directive({
  selector: '[appLongPress]',
  standalone: true,
})
export class LongPressDirective implements AfterViewInit {
  @Output() tap = new EventEmitter();
  @Output() press = new EventEmitter();
  @Input('delay') delay = 500;

  private fingerUp = new Subject<boolean>();
  private fingerMove = new Subject<void>();

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private zone: NgZone) { }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: () => this.handleFingerBehaviour(),

      onMove: () => this.fingerMove.next(),
      onEnd: () => this.fingerUp.next(true),
    });
    gesture.enable(true);
  }

  private handleFingerBehaviour(): void {
    race(this.fingerUp, timer(this.delay))
      .pipe(takeUntil(this.fingerMove), take(1))
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
