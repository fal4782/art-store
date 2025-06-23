// components/ArtworkCard.tsx
import { Link } from "react-router-dom";
import { type Artwork } from "../utils/types";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link to={`/artworks/${artwork.id}`} className="border p-4 rounded shadow">
      <h3 className="font-semibold">{artwork.title}</h3>
      <p className="text-sm">${artwork.price}</p>
    </Link>
  );
}
