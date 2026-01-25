import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkForm from "../../components/admin/ArtworkForm";
import { artworkService } from "../../services/artworkService";
import { useToast } from "../../context/ToastContext";

export default function AdminArtworkAdd() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await artworkService.createArtwork(data);
      showToast("Artwork created successfully!", "success");
      navigate("/admin/artworks");
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to create artwork", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ArtworkForm 
      title="Add New Artwork"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/artworks")}
      isLoading={isLoading}
    />
  );
}
