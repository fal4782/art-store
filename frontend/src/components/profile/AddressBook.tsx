import { useState, useEffect } from "react";
import { addressService } from "../../services/addressService";
import { theme } from "../../theme";
import type { Address, AddressInput } from "../../types/user";
import { FiPlus, FiTrash2, FiEdit2, FiMapPin } from "react-icons/fi";
import { useToast } from "../../context/ToastContext";
import AddressForm from "./AddressForm";

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const initialFormState: AddressInput = {
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState<AddressInput>(initialFormState);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await addressService.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        const updated = await addressService.updateAddress(editingId, formData);
        setAddresses(addresses.map((a) => (a.id === editingId ? updated : a)));
      } else {
        const created = await addressService.createAddress(formData);
        // If created is default, update local state to reflect that others might have lost default status
        if (created.isDefault) {
          setAddresses((prev) =>
            prev.map((a) => ({ ...a, isDefault: false })).concat(created),
          );
        } else {
          setAddresses([...addresses, created]);
        }
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      // Reload to ensure consistency (esp. regarding isDefault logic)
      loadAddresses();
      showToast("Address saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save address", "error");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (address: Address) => {
    setFormData({
      name: address.name,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state || "",
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  if (loading)
    return (
      <div className="max-w-3xl space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-48 rounded-xl bg-stone-200" />
            <div className="h-4 w-64 rounded-lg bg-stone-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 rounded-[32px] bg-stone-50 border border-stone-100"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: theme.colors.primary }}
          >
            Address Book
          </h1>
          <p className="opacity-60 font-medium">
            Manage your shipping destinations.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
            style={{ background: theme.colors.secondary }}
          >
            <FiPlus className="text-xl" /> Add New
          </button>
        )}
      </div>

      {showForm ? (
        <AddressForm
          title={editingId ? "Edit Address" : "New Address"}
          submitLabel={editingId ? "Update Address" : "Save Address"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isLoading={saving}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col p-6 rounded-3xl bg-white border border-stone-100 shadow-sm relative overflow-visible transition-all hover:shadow-md"
            >
              <div className="flex-1">
                {address.isDefault && (
                  <div
                    className="absolute top-0 right-0 px-4 py-2 rounded-bl-2xl rounded-tr-3xl text-xs font-black uppercase tracking-widest text-white shadow-sm"
                    style={{ background: theme.colors.secondary }}
                  >
                    Default
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-full text-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${theme.colors.primary}10`,
                      color: theme.colors.primary,
                    }}
                  >
                    <FiMapPin />
                  </div>
                  <div>
                    <h3
                      className="font-black text-lg leading-tight"
                      style={{ color: theme.colors.primary }}
                    >
                      {address.name}
                    </h3>
                    <p
                      className="opacity-60 text-sm font-bold mt-1"
                      style={{ color: theme.colors.primary }}
                    >
                      {address.phone}
                    </p>
                  </div>
                </div>

                <p
                  className="opacity-70 font-medium leading-relaxed mb-6 pl-14"
                  style={{ color: theme.colors.primary }}
                >
                  {address.line1} <br />
                  {address.line2 && (
                    <>
                      {address.line2}
                      <br />
                    </>
                  )}
                  {address.city}, {address.state} - {address.postalCode} <br />
                  {address.country}
                </p>
              </div>

              <div className="flex gap-3 pl-14 pt-4 border-t border-stone-50">
                <button
                  onClick={() => startEdit(address)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `${theme.colors.primary}10`,
                    color: theme.colors.primary,
                  }}
                >
                  <FiEdit2 /> Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `${theme.colors.error}15`,
                    color: theme.colors.error,
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
