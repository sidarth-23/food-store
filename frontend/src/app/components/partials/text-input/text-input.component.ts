import { Component, HostListener, Input } from '@angular/core';
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
  spanElement: string = ''
  @Input()
  largeInput: boolean = false
  @Input()
  onlyLetters: boolean = false
  
  @HostListener('keypress', ['$event'])
  checkInput(event: KeyboardEvent): boolean {
    const key = event.keyCode;
    if (!this.onlyLetters) return true
    return (
      (key >= 65 && key <= 90) || // A-Z
      (key >= 97 && key <= 122) || // a-z
      key === 8 // Backspace
    );
  }


  get formControl() {
    return this.control as FormControl;
  }
}
