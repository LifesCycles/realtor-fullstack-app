/**
 * Represents a property
 * @interface Property
 */
export interface Property {
  /**
   * Unique identifier
   */
  id: number;
  /**
   * Property title/name
   */
  title: string;
  /**
   * Detailed description
   */
  description: string;
  /**
   * Array of image URLs
   */
  images: string[];
  /**
   * Price in USD
   */
  price: number;
  /**
   * Number of bedrooms
   */
  bedrooms: number;
  /**
   * Number of bathrooms
   */
  bathrooms: number;
  /**
   * Total square footage
   */
  square_feet: number;
  /**
   * Street address
   */
  address: string;
  /**
   * City name
   */
  city: string;
  /**
   * State or province
   */
  state: string;
  /**
   * Postal/ZIP code
   */
  zip_code: string;
  /**
   * Type of property
   */
  property_type: string;
  /**
   * Listing type
   */
  listing_type: string;
  /**
   * ISO date string of when listing was created
   */
  created_at: string;
  /**
   * ISO date string of last update
   */
  updated_at: string;
  /**
   * Date the property was listed
   */
  listDate: string;
  /**
   * Virtual tour URL if available
   */
  virtualTourUrl?: string;
  /**
   * Latitude coordinate
   */
  latitude: number;
  /**
   * Longitude coordinate
   */
  longitude: number;
}