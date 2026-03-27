import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, MapPin } from "lucide-react";
import { artists, artworks } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";

export default function ArtistProfile() {
  const { id } = useParams();
  const artist = artists.find(a => a.id === id);

  if (!artist) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Artist not found.</p>
        <Link to="/artists" className="text-primary mt-4 inline-block">Back to Artists</Link>
      </div>
    );
  }

  const artistWorks = artworks.filter(a => a.artistId === artist.id);

  return (
    <div className="container py-8">
      <Link to="/artists" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> All Artists
      </Link>

      <div className="flex flex-col md:flex-row items-start gap-10 mb-16">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden ring-4 ring-secondary flex-shrink-0">
          <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold">{artist.name}</h1>
            {artist.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="h-3.5 w-3.5" /> Freetown, Sierra Leone
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-xl mb-6">{artist.bio}</p>
          <div className="flex gap-8 text-sm">
            <div><span className="font-bold text-foreground">{artist.followers.toLocaleString()}</span> <span className="text-muted-foreground">Followers</span></div>
            <div><span className="font-bold text-foreground">{artist.artworks}</span> <span className="text-muted-foreground">Artworks</span></div>
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-8">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artistWorks.map((a, i) => <ArtworkCard key={a.id} artwork={a} index={i} />)}
      </div>

      {artistWorks.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No artworks uploaded yet.</p>
      )}
    </div>
  );
}
