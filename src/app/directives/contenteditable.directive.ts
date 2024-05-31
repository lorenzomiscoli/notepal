import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector:
    '[contenteditable][formControlName], [contenteditable][formControl], [contenteditable][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableValueAccessor),
      multi: true,
    },
  ],
  standalone: true
})
export class ContenteditableValueAccessor implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private onTouched = () => { };
  private onChange = (_value: string) => { };
  private observer!: MutationObserver;

  constructor(
    @Inject(ElementRef) private readonly elementRef: ElementRef<Element>,
    @Inject(Renderer2) private readonly renderer: Renderer2,
  ) {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      'true'
    );
  }

  ngAfterViewInit() {
    this.observer = new MutationObserver(() => {
      this.onChange(this.elementRef.nativeElement.innerHTML);
    });

    this.observer.observe(this.elementRef.nativeElement, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  @HostListener('input')
  onInput() {
    this.observer.disconnect();
    this.onChange(this.elementRef.nativeElement.innerHTML);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: string) {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      value || ''
    );
  }

  registerOnChange(onChange: (value: string) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      String(!disabled)
    );
  }
}
