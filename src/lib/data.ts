import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";
import art5 from "@/assets/art-5.jpg";
import art6 from "@/assets/art-6.jpg";
import exhibition from "@/assets/exhibition.jpg";

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  followers: number;
  artworks: number;
  verified: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sold: boolean;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  upcoming: boolean;
  featuredArtists: string[];
}

export const artists: Artist[] = [
  { id: "1", name: "Aminata Kamara", bio: "Contemporary painter blending traditional Mende motifs with modern abstract expressionism. Based in Freetown.", image: artist1, followers: 2340, artworks: 28, verified: true },
  { id: "2", name: "Ibrahim Koroma", bio: "Master wood sculptor preserving the ancient carving traditions of Sierra Leone through contemporary forms.", image: artist2, followers: 1890, artworks: 35, verified: true },
  { id: "3", name: "Mohamed Sesay", bio: "Young emerging artist exploring vibrant landscapes and cultural identity through acrylic on canvas.", image: artist3, followers: 980, artworks: 15, verified: true },
];

export const artworks: Artwork[] = [
  { id: "1", title: "Rhythms of the Ancestors", artistId: "1", artistName: "Aminata Kamara", price: 2500, image: art1, category: "Painting", description: "A bold abstract painting inspired by the rhythmic dances of the Mende people, rendered in vibrant earth tones and geometric forms.", sold: false },
  { id: "2", title: "Guardian Spirit", artistId: "2", artistName: "Ibrahim Koroma", price: 4200, image: art2, category: "Sculpture", description: "A traditional wooden mask sculpture representing protective ancestral spirits, hand-carved from iroko wood.", sold: false },
  { id: "3", title: "Village at Sunset", artistId: "3", artistName: "Mohamed Sesay", price: 1800, image: art3, category: "Painting", description: "A colorful landscape depicting a Sierra Leonean village at golden hour, with palm trees swaying against a vibrant sky.", sold: false },
  { id: "4", title: "Woven Heritage", artistId: "1", artistName: "Aminata Kamara", price: 3100, image: art4, category: "Textile", description: "Traditional country cloth textile art featuring intricate geometric patterns passed down through generations.", sold: true },
  { id: "5", title: "Earth Vessels", artistId: "2", artistName: "Ibrahim Koroma", price: 1500, image: art5, category: "Ceramics", description: "A collection of hand-crafted ceramic vessels inspired by traditional Sierra Leonean pottery techniques.", sold: false },
  { id: "6", title: "Mother & Child", artistId: "1", artistName: "Aminata Kamara", price: 5500, image: art6, category: "Painting", description: "An emotive portrait celebrating the bond between mother and child, painted in warm, rich tones.", sold: false },
];

export const exhibitions: Exhibition[] = [
  { id: "1", title: "Voices of the Land", date: "April 15-30, 2026", location: "National Museum, Freetown", description: "A landmark exhibition showcasing 50 works from Sierra Leone's most celebrated contemporary artists.", image: exhibition, upcoming: true, featuredArtists: ["Aminata Kamara", "Ibrahim Koroma"] },
  { id: "2", title: "New Horizons", date: "June 1-15, 2026", location: "Cotton Tree Gallery, Freetown", description: "Emerging artists redefining Sierra Leonean art for the global stage.", image: exhibition, upcoming: true, featuredArtists: ["Mohamed Sesay"] },
  { id: "3", title: "Roots & Routes", date: "January 10-25, 2026", location: "British Council, Freetown", description: "An exploration of diaspora and identity through mixed media installations.", image: exhibition, upcoming: false, featuredArtists: ["Aminata Kamara"] },
];

export const categories = ["All", "Painting", "Sculpture", "Textile", "Ceramics", "Mixed Media"];

export const currencies = [
  { code: "NLE", symbol: "NLe", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.044 },
  { code: "EUR", symbol: "€", rate: 0.041 },
  { code: "GBP", symbol: "£", rate: 0.035 },
];

export function convertPrice(priceNLE: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  const converted = priceNLE * currency.rate;
  if (currencyCode === "NLE") return `${currency.symbol} ${priceNLE.toLocaleString()}`;
  return `${currency.symbol}${converted.toFixed(2)}`;
}
