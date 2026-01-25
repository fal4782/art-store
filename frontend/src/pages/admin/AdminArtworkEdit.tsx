import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { useNavigate, useParams } from "react-router-dom";
import ArtworkForm from "../../components/admin/ArtworkForm";
import { artworkService } from "../../services/artworkService";
import { useToast } from "../../context/ToastContext";
import type { Artwork } from "../../types/artwork";
import { FiLoader } from "react-icons/fi";

export default function AdminArtworkEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      artworkService
        .getArtwork(id)
        .then(setArtwork)
        .catch((err) => {
          console.error(err);
          showToast("Failed to load artwork", "error");
          navigate("/admin/artworks");
        })
        .finally(() => setFetching(false));
    }
  }, [id, navigate, showToast]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await artworkService.updateArtwork(id, data);
      showToast("Artwork updated successfully!", "success");
      navigate("/admin/artworks");
    } catch (err: any) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to update artwork",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <FiLoader
          className="animate-spin text-4xl"
          style={{ color: theme.colors.secondary }}
        />
        <p className="font-bold opacity-40">Fetching artwork details...</p>
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <ArtworkForm
      title="Edit Artwork"
      initialData={artwork}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/artworks")}
      isLoading={isLoading}
    />
  );
}
