import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng, LatLngLiteral } from 'leaflet';
import { Observable } from 'rxjs';
import { Geocoding } from '../shared/models/Geocoding';
import { LocationTagger } from '../shared/models/LocationTagger';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getCurrentLocation(): Observable<LatLngLiteral> {
    return new Observable((observer) => {
      if (!navigator.geolocation) return;

      return navigator.geolocation.getCurrentPosition((pos) => {
        observer.next({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    });
  }

  getAddressFromLatLng(latLng: LatLng): Observable<Geocoding> {
    const lat = latLng.lat.toFixed(6)
    const lng = latLng.lng.toFixed(6)
    return this.http.get<Geocoding>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
  }

  getLocationFromAddress(address: string) {
    return this.http.get<LocationTagger>(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`)
}
}
