import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IuserRegister';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  profileForm!:FormGroup;
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
    const currentUser = this.userService.currentUser;
    this.profileForm.patchValue({
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
    });

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
}
