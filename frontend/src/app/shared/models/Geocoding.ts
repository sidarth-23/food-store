import { LatLng } from "leaflet"

export interface Geocoding {
  plus_code : {
    compound_code: string,
    global_code: string
  },
  results: Result[],
  status: string
}

interface Result {
  address_components: AddressComponent[],
  formatted_address: string,
  geometry: Geometry,
  place_id: string,
  plus_code: {
    compound_code: string,
    global_code: string
  },
  types: string[]
}

interface AddressComponent {
  long_name: string,
  short_name: string,
  types: string[]
}

interface Geometry {
  bounds: {
    northeast: LatLng,
    southwest: LatLng
  },
  location: LatLng,
  location_type: string,
  viewport : {
    northeast: LatLng,
    southwest: LatLng
  }
}

