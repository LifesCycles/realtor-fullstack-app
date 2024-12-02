import { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Waterfront Villa",
    description: "Stunning 4-bedroom waterfront villa with panoramic ocean views. Features include a private infinity pool, gourmet kitchen with marble countertops, home theater, wine cellar, and a 3-car garage. Smart home technology throughout.",
    images: [
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800",  // Luxury waterfront mansion exterior
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800",  // Elegant living room
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",  // Modern kitchen
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800"   // Master suite
    ],
    price: 2450000,
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 4200,
    address: "123 Ocean Drive",
    city: "Miami Beach",
    state: "FL",
    zip_code: "33139",
    latitude: 25.7747,
    longitude: -80.1342,
    property_type: "Villa",
    listing_type: "Sale",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    listDate: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Modern Downtown Penthouse",
    description: "Stunning penthouse with panoramic city views. Features floor-to-ceiling windows, gourmet kitchen, and private rooftop terrace.",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",  // Modern luxury home exterior
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",  // Penthouse living area
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",  // Modern bedroom
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800"   // Luxury dining area
    ],
    price: 1850000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2800,
    address: "456 Collins Ave",
    city: "Miami Beach",
    state: "FL",
    zip_code: "33139",
    latitude: 25.7816,
    longitude: -80.1339,
    property_type: "Penthouse",
    listing_type: "Sale",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    listDate: "2024-01-15T10:00:00Z"
  },
  {
    id: 3,
    title: "Oceanfront Luxury Condo",
    description: "Direct oceanfront condo with stunning views. Recently renovated with high-end finishes.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",  // Oceanfront building exterior
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800",  // Living room with view
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",  // Master bedroom
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=800"   // Luxury living space
    ],
    price: 1650000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1800,
    address: "789 Ocean Dr",
    city: "Miami Beach",
    state: "FL",
    zip_code: "33139",
    latitude: 25.7785,
    longitude: -80.1300,
    property_type: "Condo",
    listing_type: "Sale",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    listDate: "2024-01-15T10:00:00Z"
  },
  {
    id: 4,
    title: "Charming Historic Townhouse",
    description: "Beautifully restored 19th-century townhouse with original hardwood floors and modern amenities. Features include a gourmet kitchen, formal dining room, private garden, and roof deck.",
    images: [
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",  // Classic townhouse exterior
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",  // Traditional living room
      "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=800",  // Formal dining room
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800"   // Library study
    ],
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2200,
    address: "456 Heritage Lane",
    city: "Boston",
    state: "MA",
    zip_code: "02108",
    latitude: 42.3601,
    longitude: -71.0589,
    property_type: "Townhouse",
    listing_type: "Sale",
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    listDate: "2024-01-13T09:15:00Z"
  },
  {
    id: 5,
    title: "Contemporary Mountain Retreat",
    description: "Architectural masterpiece with breathtaking mountain views. Features include vaulted ceilings, floor-to-ceiling windows, gourmet kitchen, multiple decks, and a hot tub.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",  // Modern mountain mansion exterior
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",  // Mountain view living room
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",  // Modern luxury kitchen
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"   // Luxury bedroom
    ],
    price: 1750000,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 3500,
    address: "321 Mountain View Rd",
    city: "Aspen",
    state: "CO",
    zip_code: "81611",
    latitude: 39.1911,
    longitude: -106.8175,
    property_type: "House",
    listing_type: "Sale",
    created_at: "2024-01-12T14:45:00Z",
    updated_at: "2024-01-12T14:45:00Z",
    listDate: "2024-01-12T14:45:00Z"
  },
  {
    id: 6,
    title: "Luxury Beachfront Condo",
    description: "Elegant beachfront condo with direct ocean access. Recently renovated with high-end finishes, featuring an open concept living area, gourmet kitchen, and large private balcony.",
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",  // Beachfront condo exterior
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800",  // Ocean view living room
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",  // Modern kitchen
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800"   // Beachview bedroom
    ],
    price: 895000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1800,
    address: "567 Coastal Way",
    city: "Malibu",
    state: "CA",
    zip_code: "90265",
    latitude: 34.0259,
    longitude: -118.7798,
    property_type: "Condo",
    listing_type: "Sale",
    created_at: "2024-01-11T11:20:00Z",
    updated_at: "2024-01-11T11:20:00Z",
    listDate: "2024-01-11T11:20:00Z"
  },
  {
    id: 7,
    title: "Seattle Skyline Penthouse",
    description: "Luxurious penthouse with stunning views of the Space Needle and Puget Sound. Features smart home technology, chef's kitchen, and private terrace.",
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",  // Modern glass building exterior
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=800",  // City view living room
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",  // Luxury kitchen
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800"   // Master bedroom
    ],
    price: 2100000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2400,
    address: "1000 4th Ave",
    city: "Seattle",
    state: "WA",
    zip_code: "98104",
    latitude: 47.6062,
    longitude: -122.3321,
    property_type: "Penthouse",
    listing_type: "Sale",
    created_at: "2024-01-10T15:30:00Z",
    updated_at: "2024-01-10T15:30:00Z",
    listDate: "2024-01-10T15:30:00Z"
  },
  {
    id: 8,
    title: "Chicago River View Apartment",
    description: "Modern apartment with panoramic views of the Chicago River and skyline. High-end finishes throughout, floor-to-ceiling windows, and designer kitchen.",
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",  // Modern high-rise exterior
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800",  // River view living room
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",  // Luxury interior
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800"   // Bedroom suite
    ],
    price: 1450000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1600,
    address: "401 N Wabash Ave",
    city: "Chicago",
    state: "IL",
    zip_code: "60611",
    latitude: 41.8781,
    longitude: -87.6298,
    property_type: "Apartment",
    listing_type: "Sale",
    created_at: "2024-01-09T12:00:00Z",
    updated_at: "2024-01-09T12:00:00Z",
    listDate: "2024-01-09T12:00:00Z"
  },
  {
    id: 9,
    title: "Austin Modern Ranch",
    description: "Contemporary ranch-style home with Hill Country views. Open concept living, outdoor kitchen, pool, and native landscaping.",
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",  // Modern ranch exterior
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",  // Open concept living
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",  // Gourmet kitchen
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800"   // Master suite
    ],
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 3200,
    address: "1200 Barton Creek Blvd",
    city: "Austin",
    state: "TX",
    zip_code: "78735",
    latitude: 30.2672,
    longitude: -97.7431,
    property_type: "House",
    listing_type: "Sale",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-08T14:20:00Z",
    listDate: "2024-01-08T14:20:00Z"
  },
  {
    id: 10,
    title: "NYC Upper East Side Classic",
    description: "Pre-war apartment with Central Park views. High ceilings, original moldings, and modern updates throughout.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",  // Classic high-rise exterior
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800",  // Living room
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",  // Kitchen
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800"   // Master bedroom
    ],
    price: 2850000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1800,
    address: "900 Fifth Avenue",
    city: "New York",
    state: "NY",
    zip_code: "10021",
    latitude: 40.7731,
    longitude: -73.9712,
    property_type: "Apartment",
    listing_type: "Sale",
    created_at: "2024-01-07T09:45:00Z",
    updated_at: "2024-01-07T09:45:00Z",
    listDate: "2024-01-07T09:45:00Z"
  }
];