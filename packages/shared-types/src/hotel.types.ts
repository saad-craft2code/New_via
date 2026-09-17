export type HotelAmenity =
  | 'wifi'
  | 'pool'
  | 'gym'
  | 'spa'
  | 'parking'
  | 'restaurant'
  | 'bar'
  | 'business_center'
  | 'concierge'
  | 'room_service'
  | 'airport_shuttle'
  | 'family_friendly'
  | 'pet_friendly'
  | 'beach_access';

export type BedType =
  | 'single'
  | 'double'
  | 'queen'
  | 'king'
  | 'twin'
  | 'sofa_bed'
  | 'bunk';

export type RoomAmenity =
  | 'ac'
  | 'minibar'
  | 'safe'
  | 'tv'
  | 'balcony'
  | 'kitchen'
  | 'washing_machine'
  | 'city_view'
  | 'sea_view';

export interface Hotel {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  location: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities: HotelAmenity[];
  images: string[];
  policies: {
    checkIn?: string;
    checkOut?: string;
    smokingAllowed?: boolean;
    petsAllowed?: boolean;
    cancellationPolicy?: string;
  };
  roomCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomType: string;
  bedType: BedType;
  maxGuests: number;
  pricePerNight: number;
  size?: number | null;
  amenities: RoomAmenity[];
  images: string[];
  totalUnits: number;
  availableUnits: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelDto {
  name: string;
  description: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  location: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  amenities: HotelAmenity[];
  images: string[];
  policies?: Hotel['policies'];
}

export type UpdateHotelDto = Partial<CreateHotelDto>;

export interface CreateRoomDto {
  roomType: string;
  bedType: BedType;
  maxGuests: number;
  pricePerNight: number;
  size?: number;
  amenities: RoomAmenity[];
  images: string[];
  totalUnits: number;
}

export type UpdateRoomDto = Partial<CreateRoomDto>;
