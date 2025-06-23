import { useArtworks } from "../hooks";
import { useNavigate } from "react-router-dom";

export default function Artworks() {
  const navigate = useNavigate();
  const { artworks, artworksLoading, error } = useArtworks();

  if (artworksLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading artworks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            onClick={() => navigate(`/artwork/${artwork.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200">
              {artwork.images && artwork.images.length > 0 ? (
                <img
                  src={artwork.images[0]}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {artwork.title}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {artwork.category}
                </span>
              </div>

              {artwork.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {artwork.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  ${artwork.price}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    artwork.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {artwork.isAvailable ? "Available" : "Sold"}
                </span>
              </div>

              {artwork.medium && (
                <p className="text-xs text-gray-500 mt-2">{artwork.medium}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No artworks available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
