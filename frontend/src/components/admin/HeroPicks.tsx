import { useEffect, useState } from "react";
import { FiImage, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { theme } from "../../theme";
import { artworkService } from "../../services/artworkService";
import { useToast } from "../../context/ToastContext";
import type { Artwork } from "../../types/artwork";
import { showImageFallback } from "../../utils/imageFallback";
import { sizedImage, IMAGE_WIDTH } from "../../utils/sizedImage";

const SLOT_LABELS = ["Slot 1 · Large", "Slot 2", "Slot 3"];

function Thumb({ artwork, size }: { artwork?: Artwork; size: string }) {
  return (
    <div
      className={`${size} rounded-xl overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center text-stone-300`}
    >
      {artwork?.images?.[0] ? (
        <img
          onError={showImageFallback}
          src={sizedImage(artwork.images[0], IMAGE_WIDTH.thumb)}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <FiImage size={20} />
      )}
    </div>
  );
}

/**
 * Admin panel for the three artworks in the homepage hero. Changes are saved
 * straight away and undone if saving fails. When a slot is empty the hero
 * fills it with the newest pieces, preferring ones that aren't featured.
 */
export default function HeroPicks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [choosing, setChoosing] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Admins get drafts too, so a pick that was unpublished still shows here
    artworkService
      .getArtworks({ limit: 100 })
      .then((res) => {
        setArtworks(res.artworks);
        const next: (string | null)[] = [null, null, null];
        for (const a of res.artworks) {
          if (a.heroSlot && a.heroSlot >= 1 && a.heroSlot <= 3)
            next[a.heroSlot - 1] = a.id;
        }
        setSlots(next);
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to load the hero picks", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const byId = new Map(artworks.map((a) => [a.id, a]));

  const save = async (next: (string | null)[]) => {
    const previous = slots;
    setSlots(next);
    setChoosing(null);
    setSearch("");
    setSaving(true);
    try {
      await artworkService.setHeroSlots(next);
    } catch (err: any) {
      console.error(err);
      setSlots(previous);
      showToast(
        err.response?.data?.message || "Couldn't save the hero",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const setSlot = (index: number, id: string | null) =>
    save(slots.map((current, i) => (i === index ? id : current)));

  const choices = artworks.filter(
    (a) =>
      a.isAvailable &&
      a.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div
      className="rounded-[2.5rem] p-6 md:p-10 border shadow-sm"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: `${theme.colors.primary}08`,
      }}
    >
      <div className="space-y-1 mb-8">
        <h2
          className="text-xl md:text-2xl font-black"
          style={{ color: theme.colors.primary }}
        >
          Homepage hero
        </h2>
        <p className="text-sm font-bold opacity-50">
          Pick up to 3 published pieces for the top of the homepage. Empty slots
          show the newest pieces instead.
        </p>
      </div>

      {loading ? (
        <p className="font-bold opacity-40">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {slots.map((id, index) => {
              const artwork = id ? byId.get(id) : undefined;
              const isChoosing = choosing === index;
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl border-2 space-y-3"
                  style={{
                    borderColor: isChoosing
                      ? theme.colors.secondary
                      : `${theme.colors.primary}10`,
                  }}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    {SLOT_LABELS[index]}
                  </p>
                  <div className="flex items-center gap-3 min-h-14">
                    {artwork ? (
                      <>
                        <Thumb artwork={artwork} size="w-14 h-14" />
                        <div className="min-w-0">
                          <p
                            className="font-bold text-sm truncate"
                            style={{ color: theme.colors.primary }}
                          >
                            {artwork.name}
                          </p>
                          {!artwork.isAvailable ? (
                            <p
                              className="text-[10px] font-black uppercase tracking-widest"
                              style={{ color: theme.colors.error }}
                            >
                              Draft, not shown
                            </p>
                          ) : (
                            artwork.isFeatured && (
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                Also featured
                              </p>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm font-bold opacity-40">Empty</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setChoosing(isChoosing ? null : index)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-black border transition-colors hover:bg-stone-50 disabled:opacity-50"
                      style={{
                        color: theme.colors.primary,
                        borderColor: `${theme.colors.primary}20`,
                      }}
                    >
                      {isChoosing ? (
                        "Cancel"
                      ) : (
                        <>
                          <FiPlus /> {artwork ? "Change" : "Choose"}
                        </>
                      )}
                    </button>
                    {artwork && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setSlot(index, null)}
                        aria-label={`Remove ${artwork.name} from the hero`}
                        className="px-3 py-2 rounded-xl border transition-colors hover:bg-stone-50 disabled:opacity-50"
                        style={{
                          color: theme.colors.error,
                          borderColor: `${theme.colors.primary}20`,
                        }}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {choosing !== null && (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Choose a piece for ${SLOT_LABELS[choosing].toLowerCase()}...`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 outline-none font-bold"
                  style={{
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.accent}60`,
                    backgroundColor: `${theme.colors.accent}15`,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
                {choices.map((artwork) => {
                  const inSlot = slots.indexOf(artwork.id);
                  const takenElsewhere = inSlot !== -1 && inSlot !== choosing;
                  return (
                    <button
                      key={artwork.id}
                      type="button"
                      disabled={saving || takenElsewhere}
                      onClick={() => setSlot(choosing, artwork.id)}
                      className="text-left space-y-2 p-2 rounded-2xl transition-colors hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Thumb artwork={artwork} size="w-full aspect-square" />
                      <p
                        className="text-xs font-bold line-clamp-2"
                        style={{ color: theme.colors.primary }}
                      >
                        {artwork.name}
                      </p>
                      {takenElsewhere && (
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          In slot {inSlot + 1}
                        </p>
                      )}
                    </button>
                  );
                })}
                {choices.length === 0 && (
                  <p className="col-span-full text-sm font-bold opacity-40">
                    No published pieces match.
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
