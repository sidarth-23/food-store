import { LocationService } from 'src/app/services/location.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IuserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';
import { PasswordStrengthValidator } from 'src/app/shared/validators/password_strength_validator';
import { ToastrService } from 'ngx-toastr';

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
    private locationService: LocationService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z]*')]],
      lastName: ['', [Validators.pattern('[a-zA-Z]*')]],
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
    const username = currentUser.name.slice().split(' ')
    this.profileForm.patchValue({
      name: username[0].trim(),
      lastName: username[1]?.trim() || '',
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
    let nameToSend: string;
    if (fv.lastName !== '') {
      nameToSend = fv.name + ' ' + fv.lastName
    } else {
      nameToSend = fv.name
    }
    const user = {
      name: nameToSend,
      email: fv.email,
      address: fv.address
    };

    this.locationService.getLocationFromAddress(user.address).subscribe((res) => {
      if (res.status === 'ZERO_RESULTS') {
        this.toastrService.error('Please enter a valid address', 'Invalid address')
        return
      }
      this.userService.updateUser(user).subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      })
    })
  }

  submitPass() {
    this.isSubmitted = true;
    if (this.passForm.invalid) return; 

    const fv = this.passForm.value;
    const user = {
      email: fv.email,
      password: fv.password
    };
    this.userService.updatePass(user).subscribe((updatedUser) => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }
}
