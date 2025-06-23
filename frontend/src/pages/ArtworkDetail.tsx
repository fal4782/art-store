import { useParams, useNavigate } from "react-router-dom";
import { useArtwork } from "../hooks";
import { useAuth } from "../hooks";

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { artwork, artworkLoading, error } = useArtwork({ id: id || "" });

  if (artworkLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading artwork...</div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || "Artwork not found"}</div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Navigate to checkout with this artwork
    navigate("/checkout", { state: { artwork } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {artwork.images && artwork.images.length > 0 ? (
              <img
                src={artwork.images[0]}
                alt={artwork.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Additional images if any */}
          {artwork.images && artwork.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {artwork.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 rounded overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${artwork.title} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {artwork.title}
              </h1>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {artwork.category}
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ${artwork.price.toLocaleString()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  artwork.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {artwork.isAvailable ? "Available" : "Sold Out"}
              </span>
            </div>
          </div>

          {artwork.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          )}

          {/* Artwork Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Details</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {artwork.medium && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Medium:</span>
                  <span className="font-medium">{artwork.medium}</span>
                </div>
              )}
              {artwork.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">{artwork.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{artwork.category}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6">
            {artwork.isAvailable ? (
              <>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Buy Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Questions about this piece?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Contact us for more information or to arrange a viewing.
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
