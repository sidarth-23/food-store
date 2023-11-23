import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  LatLng,
  LatLngExpression,
  LatLngLiteral,
  LatLngTuple,
  LeafletMouseEvent,
  Map,
  Marker,
  icon,
  map,
  marker,
  tileLayer,
} from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Order';
import { latLng } from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnChanges, OnInit {
  @Output() locationClicked: EventEmitter<LatLng> = new EventEmitter<LatLng>();
  @Input()
  order!: Order;
  @Input()
  readonly = false;
  private markerHasBeenSet = false;
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;

  map!: Map;
  currentMarker!: Marker;
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.markerHasBeenSet = false;

    if (this.order.addressLatLng) {
      this.initializeMap(this.order.addressLatLng);
      if (this.readonly) {
        this.showLocationOnReadOnlyMode()
      }
    }
  }

  ngOnChanges(): void {
    if (!this.order) return;

    if (this.readonly && this.addressLatLng) {
      this.showLocationOnReadOnlyMode();
    }

    // Check if the marker has not been set yet
    if (!this.markerHasBeenSet && this.addressLatLng) {
      this.initializeMap(this.addressLatLng);
      this.markerHasBeenSet = true; // Set the flag to true to prevent further updates
    }
  }

  showLocationOnReadOnlyMode() {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);
    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap(latLng?: LatLng) {
    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    if (latLng) {
      this.map.setView(latLng, this.MARKER_ZOOM_LEVEL);
      this.setMarker(latLng);
      this.markerHasBeenSet = true
    } else {
      this.map.setView(this.DEFAULT_LATLNG, 1);
    }

    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
      this.locationClicked.emit(e.latlng);
    });
  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlngLiteral: LatLngLiteral) => {
        const latlng: LatLng = latLng(latlngLiteral.lat, latlngLiteral.lng);
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
        this.locationClicked.emit(latlng);
      },
    });
  }

  setMarker(latlng: LatLngExpression) {
    this.addressLatLng = latlng as LatLng;
    this.locationClicked.emit(this.addressLatLng);

    // Check if the marker has not been set yet
    if (!this.markerHasBeenSet) {
      if (this.currentMarker) {
        this.currentMarker.setLatLng(latlng);
        return;
      }

      this.currentMarker = marker(latlng, {
        draggable: true,
        icon: this.MARKER_ICON,
      }).addTo(this.map);

      this.currentMarker.on('dragend', () => {
        this.addressLatLng = this.currentMarker.getLatLng();
      });

      this.markerHasBeenSet = true; // Set the flag to true to prevent further updates
    }
  }

  set addressLatLng(latlng: LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }
}
