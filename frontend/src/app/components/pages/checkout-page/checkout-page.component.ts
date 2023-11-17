import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LatLng } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  constructor(
    cartService: CartService,
    private userService: UserService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private locationService: LocationService,
    private router: Router
  ) {
    const cart = cartService.getCart();
    this.order.items = cart.item;
    this.order.totalPrice = cart.totalPrice;
  }

  ngOnInit(): void {
    let { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name, [Validators.required]],
      address: [address, [Validators.required]],
    });
    this.locationService.getLocationFromAddress(address).subscribe((res) => {
      const temp = res.results[0].geometry.location;
      const lat = temp.lat;
      const lng = temp.lng;
      this.order.addressLatLng = new LatLng(lat, lng);
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  onLocationClicked(latLng: LatLng) {
    this.locationService.getAddressFromLatLng(latLng).subscribe((res) => {
      this.order.address = res.plus_code.compound_code;
      this.checkoutForm.patchValue({
        address: this.order.address,
      });
    });
  }

  createOrder() {
    if (this.checkoutForm.invalid) {
      console.log('invalid');
      let message: string = '';
      if (this.fc.name.invalid && this.fc.address.invalid) {
        message = 'Please fill both the fields';
      } else if (this.fc.name.invalid) {
        message = 'Please fill the name field';
      } else {
        message = 'Please fill the address field';
        this.toastrService.warning(message, 'Invalid Inputs');
        return;
      }
    }

    if (!this.order.addressLatLng) {
      console.log('No location');
      this.toastrService.warning(
        'Please select your location on the map',
        'Location'
      );
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;
    this.orderService.create(this.order).subscribe({
      next: () => {
        this.router.navigateByUrl('/payment');
      },
      error: (err) => {
        this.toastrService.error(err.error, 'Cart');
      },
    });
  }
}
