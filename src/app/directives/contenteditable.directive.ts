import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
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
export class ContenteditableValueAccessor implements ControlValueAccessor {
  private onTouched = () => { };
  private onChange = (_value: string) => { };

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

  @HostListener('input')
  onInput() {
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
