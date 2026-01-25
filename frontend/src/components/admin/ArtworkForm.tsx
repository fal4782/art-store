import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { 
  FiImage, 
  FiLink, 
  FiLayers, 
  FiTag, 
  FiInfo,
  FiBox,
  FiX,
  FiPlus,
  FiSave,
  FiArrowLeft,
  FiStar,
  FiMaximize
} from "react-icons/fi";
import { categoryService } from "../../services/categoryService";
import { tagService } from "../../services/tagService";
import type { Artwork, Category, Tag, ArtworkType } from "../../types/artwork";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface ArtworkFormProps {
  initialData?: Partial<Artwork>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  title: string;
  isLoading?: boolean;
}

export default function ArtworkForm({ initialData, onSubmit, onCancel, title, isLoading }: ArtworkFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    type: initialData?.type || "PHYSICAL" as ArtworkType,
    priceInINR: initialData?.priceInPaise ? initialData.priceInPaise / 100 : 0,
    dimensions: initialData?.dimensions || "",
    medium: initialData?.medium || "",
    stockQuantity: initialData?.stockQuantity || 1,
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isMadeToOrder: initialData?.isMadeToOrder ?? false,
    images: initialData?.images || [] as string[],
    tags: initialData?.tags?.map(t => t.id) || [] as string[]
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
    tagService.getTags().then(setTags).catch(console.error);
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: initialData ? prev.slug : generateSlug(name) // Only auto-generate slug for new items
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl] }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      priceInPaise: Math.round(formData.priceInINR * 100)
    };
    // @ts-ignore
    delete submissionData.priceInINR;
    onSubmit(submissionData);
  };

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl transition-all outline-none font-bold border-2";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 opacity-40";

  const getInputStyle = (fieldName: string, useSecondary?: boolean) => ({ 
    color: theme.colors.primary, 
    borderColor: isFocused === fieldName ? `${useSecondary ? theme.colors.secondary : theme.colors.primary}40` : `${theme.colors.accent}40`,
    backgroundColor: isFocused === fieldName ? theme.colors.surface : `${theme.colors.accent}15`,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            type="button" 
            onClick={onCancel}
            className="p-3 rounded-2xl hover:bg-stone-100 transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-black" style={{ color: theme.colors.primary }}>{title}</h1>
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className="px-10 py-4 rounded-2xl text-white font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30 disabled:opacity-50 min-w-[180px] justify-center"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-stone-200 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiSave size={20} />
              <span>Save Artwork</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Media & Primary Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Images Section */}
          <section className="p-8 rounded-4xl border shadow-sm space-y-6" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
            <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: theme.colors.primary }}>
              <FiImage style={{ color: theme.colors.secondary }} /> Artwork Images
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-stone-50 relative group border border-stone-100">
                  <img src={url} alt="Artwork" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: theme.colors.error }}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-300 gap-2">
                <FiPlus size={24} />
                <span className="text-[10px] font-black uppercase">Add Image</span>
              </div>
            </div>

            <div className="relative">
              <FiLink className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'newImageUrl' ? 1 : 0.4 }} />
              <input 
                type="text"
                placeholder="Paste image URL here..."
                value={newImageUrl}
                onFocus={() => setIsFocused('newImageUrl')}
                onBlur={() => setIsFocused(null)}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                className={inputClass}
                style={getInputStyle('newImageUrl')}
              />
              <button 
                type="button"
                onClick={handleAddImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-xl text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                Add
              </button>
            </div>
          </section>

          {/* Basic Info */}
          <section className="p-8 rounded-4xl border shadow-sm space-y-8" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
             <h3 className="text-xl font-black flex items-center gap-3" style={{ color: theme.colors.primary }}>
              <FiInfo style={{ color: theme.colors.secondary }}/> Basic Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Artwork Name</label>
                <div className="relative">
                  <FiImage className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'name' ? 1 : 0.4 }} />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                    onChange={e => handleNameChange(e.target.value)}
                    className={inputClass}
                    style={getInputStyle('name')}
                    placeholder="Enter masterpiece title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>URL Slug</label>
                <div className="relative">
                  <FiLink className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'slug' ? 1 : 0.4 }} />
                  <input 
                    required
                    type="text" 
                    value={formData.slug}
                    onFocus={() => setIsFocused('slug')}
                    onBlur={() => setIsFocused(null)}
                    onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    className={inputClass}
                    style={getInputStyle('slug')}
                    placeholder="artwork-slug-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Description</label>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onFocus={() => setIsFocused('description')}
                  onBlur={() => setIsFocused(null)}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-6 rounded-2xl transition-all outline-none font-bold border-2 resize-none"
                  style={getInputStyle('description')}
                  placeholder="Tell the story behind this piece..."
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Settings & Organization */}
        <div className="space-y-10">
          {/* Organization */}
          <section className="p-8 rounded-4xl border shadow-sm space-y-8" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
            <h3 className="text-xl font-black flex items-center gap-3" style={{ color: theme.colors.primary }}>
              <FiLayers style={{ color: theme.colors.secondary }} /> Organization
            </h3>

            <div className="space-y-6">
               <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Category</label>
                <div className="relative">
                  <FiLayers className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'categoryId' ? 1 : 0.4 }} />
                  <select 
                    required
                    value={formData.categoryId}
                    onFocus={() => setIsFocused('categoryId')}
                    onBlur={() => setIsFocused(null)}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
                    style={getInputStyle('categoryId')}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <button 
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all hover:cursor-pointer`}
                      style={{
                        backgroundColor: formData.tags.includes(t.id) ? theme.colors.secondary : 'transparent',
                        borderColor: formData.tags.includes(t.id) ? theme.colors.secondary : `${theme.colors.accent}40`,
                        color: formData.tags.includes(t.id) ? 'white' : `${theme.colors.primary}a0`
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Type */}
          <section className="p-8 rounded-4xl border shadow-sm space-y-8" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
            <h3 className="text-xl font-black flex items-center gap-3" style={{ color: theme.colors.primary }}>
              <FaIndianRupeeSign style={{ color: theme.colors.secondary }} /> Pricing & Logistics
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Price (INR)</label>
                <div className="relative">
                  <FaIndianRupeeSign className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'price' ? 1 : 0.4 }} />
                  <input 
                    required
                    type="number" 
                    value={formData.priceInINR}
                    onFocus={() => setIsFocused('price')}
                    onBlur={() => setIsFocused(null)}
                    onChange={e => setFormData({ ...formData, priceInINR: parseFloat(e.target.value) || 0 })}
                    className={inputClass}
                    style={getInputStyle('price')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Artwork Type</label>
                <div className="flex gap-2 p-1 rounded-2xl border-2 transition-all" style={{ backgroundColor: `${theme.colors.accent}15`, borderColor: `${theme.colors.accent}40` }}>
                  {['PHYSICAL', 'DIGITAL', 'BOTH'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type as ArtworkType })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:cursor-pointer`}
                      style={{
                        backgroundColor: formData.type === type ? theme.colors.secondary : 'transparent',
                        color: formData.type === type ? 'white' : `${theme.colors.primary}a0`,
                        boxShadow: formData.type === type ? `0 4px 12px -4px ${theme.colors.secondary}60` : 'none'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className={labelClass} style={{ color: theme.colors.primary }}>Stock</label>
                   <div className="relative">
                    <FiBox className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'stock' ? 1 : 0.4 }} />
                    <input 
                      type="number" 
                      value={formData.stockQuantity}
                      onFocus={() => setIsFocused('stock')}
                      onBlur={() => setIsFocused(null)}
                      onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      style={getInputStyle('stock')}
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                <label className={labelClass} style={{ color: theme.colors.primary }}>Dimensions</label>
                <div className="relative">
                  <FiMaximize className={iconClass} style={{ color: theme.colors.secondary, opacity: isFocused === 'dimensions' ? 1 : 0.4 }} />
                  <input 
                    type="text" 
                    value={formData.dimensions}
                    onFocus={() => setIsFocused('dimensions')}
                    onBlur={() => setIsFocused(null)}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    className={inputClass}
                    style={getInputStyle('dimensions', true)}
                    placeholder="24 x 36 inches"
                  />
                </div>
              </div>
                
              </div>

             <div className="space-y-2">
                   <label className={labelClass} style={{ color: theme.colors.primary }}>Medium</label>
                   <div className="relative">
                    <FiTag className={iconClass} style={{ color: theme.colors.primary, opacity: isFocused === 'medium' ? 1 : 0.4 }} />
                    <input 
                      type="text" 
                      value={formData.medium}
                      onFocus={() => setIsFocused('medium')}
                      onBlur={() => setIsFocused(null)}
                      onChange={e => setFormData({ ...formData, medium: e.target.value })}
                      className={inputClass}
                      style={getInputStyle('medium')}
                    />
                  </div>
                </div>
            </div>
          </section>

          {/* Visibility & Status */}
          <section className="p-8 rounded-4xl border shadow-sm space-y-6" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.primary}08` }}>
             <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}>
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all`}
                    style={{
                      backgroundColor: formData.isAvailable ? `${theme.colors.success}15` : `${theme.colors.accent}15`,
                      color: formData.isAvailable ? theme.colors.success : `${theme.colors.primary}40`
                    }}
                  >
                    <FiSave size={20} />
                  </div>
                  <div>
                    <h4 className="font-black" style={{ color: theme.colors.primary }}>Publish Artwork</h4>
                    <p className="text-[10px] font-bold opacity-40 uppercase">Make it visible to customers</p>
                  </div>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative`} style={{ backgroundColor: formData.isAvailable ? theme.colors.success : `${theme.colors.accent}40` }}>
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${formData.isAvailable ? "left-7" : "left-1"}`} />
                </div>
             </div>

             <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}>
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all`}
                    style={{
                      backgroundColor: formData.isFeatured ? `${theme.colors.warning}15` : `${theme.colors.accent}15`,
                      color: formData.isFeatured ? theme.colors.warning : `${theme.colors.primary}40`
                    }}
                  >
                    <FiStar size={20} />
                  </div>
                  <div>
                    <h4 className="font-black" style={{ color: theme.colors.primary }}>Feature on Home</h4>
                    <p className="text-[10px] font-bold opacity-40 uppercase">Showcase in hero sections</p>
                  </div>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative`} style={{ backgroundColor: formData.isFeatured ? theme.colors.warning : `${theme.colors.accent}40` }}>
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${formData.isFeatured ? "left-7" : "left-1"}`} />
                </div>
             </div>

             <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData({ ...formData, isMadeToOrder: !formData.isMadeToOrder })}>
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all`}
                    style={{
                      backgroundColor: formData.isMadeToOrder ? `${theme.colors.info}15` : `${theme.colors.accent}15`,
                      color: formData.isMadeToOrder ? theme.colors.info : `${theme.colors.primary}40`
                    }}
                  >
                    <FiBox size={20} />
                  </div>
                  <div>
                    <h4 className="font-black" style={{ color: theme.colors.primary }}>Made to Order</h4>
                    <p className="text-[10px] font-bold opacity-40 uppercase">Crafted after purchase</p>
                  </div>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative`} style={{ backgroundColor: formData.isMadeToOrder ? theme.colors.info : `${theme.colors.accent}40` }}>
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${formData.isMadeToOrder ? "left-7" : "left-1"}`} />
                </div>
             </div>
          </section>
        </div>
      </div>
    </form>
  );
}
