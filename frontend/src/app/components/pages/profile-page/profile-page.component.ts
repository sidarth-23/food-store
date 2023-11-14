import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IuserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';
import { PasswordStrengthValidator } from 'src/app/shared/validators/password_strength_validator';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  profileForm!:FormGroup;
  passForm!: FormGroup;
  isSubmitted = false;

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z]*')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.passForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), PasswordStrengthValidator()]],
      confirmPass: ['', Validators.required],
    },{
      validators: PasswordsMatchValidator('password', 'confirmPass')
    });
    const currentUser = this.userService.currentUser;
    this.profileForm.patchValue({
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
    });
    this.passForm.patchValue({
      email: currentUser.email
    })

    this.returnUrl= this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.profileForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.profileForm.invalid) return;

    const fv= this.profileForm.value;
    const user = {
      name: fv.name,
      email: fv.email,
      address: fv.address
    };

    this.userService.updateUser(user).subscribe(_ => {
      console.log('returnUrl',this.returnUrl)
      this.router.navigateByUrl(this.returnUrl);
    })
  }

  submitPass() {
    this.isSubmitted = true;
    if (this.passForm.invalid) return; // Corrected the form name here

    const fv = this.passForm.value;
    const user = {
      email: fv.email,
      password: fv.password
    };

    this.userService.updatePass(user).subscribe(_ => {
      console.log('returnUrl', this.returnUrl)
      this.router.navigateByUrl(this.returnUrl);
    })
  }
}
