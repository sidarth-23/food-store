import { AbstractControl, ValidatorFn } from '@angular/forms';

export function PasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value) {
      const containsCapitalLetter = /[A-Z]/.test(control.value);
      const containsNumber = /[0-9]/.test(control.value);
      const containsSpecialCharacter = /[!@#$%^&*]/.test(control.value);

      if (!(containsCapitalLetter && containsNumber && containsSpecialCharacter)) {
        return { passwordStrength: true };
      }
    }

    return null;
  };
}