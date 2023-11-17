import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent {
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true;
  @Input()
  label!: string;
  @Input()
  type: 'text' | 'password' | 'email' = 'text';
  @Input()
  max!: string
  @Input()
  disabled: boolean = false
  @Input()
  spanElement: string = ''
  @Input()
  onlyLetter: boolean = false


  get formControl() {
    return this.control as FormControl;
  }

  onKeyPress(event: KeyboardEvent) {
    if (!this.onlyLetter) return true

    const key = event.keyCode
    return ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 8)
  }
}
