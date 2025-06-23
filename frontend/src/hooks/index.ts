/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  getCurrentUser,
  getArtworks,
  getArtworkById,
  getMyOrders,
  getAllOrders,
} from "../utils/api";
import type { User, Artwork, Order } from "../utils/types";
import { demoArtworks, demoOrders } from "../utils/demoData";

// Auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// User hook
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, userLoading, error };
}

// Artworks hooks
export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //     const fetchArtworks = async () => {
    //       try {
    //         const data = await getArtworks();
    //         setArtworks(data);
    //       } catch (err: any) {
    //         setError(err.response?.data?.error || "Failed to fetch artworks");
    //       } finally {
    //         setArtworksLoading(false);
    //       }
    //     };

    //     fetchArtworks();
    //   }, []);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setArtworks(demoArtworks);
      setArtworksLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { artworks, artworksLoading, error };
}

export function useArtwork({ id }: { id: string }) {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artworkLoading, setArtworkLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      //   try {
      //     const data = await getArtworkById(id);
      //     setArtwork(data);
      //   } catch (err: any) {
      //     setError(err.response?.data?.error || "Failed to fetch artwork");
      //   } finally {
      //     setArtworkLoading(false);
      //   }
      // Simulate loading delay
      setTimeout(() => {
        const foundArtwork = demoArtworks.find((art) => art.id === id);
        if (foundArtwork) {
          setArtwork(foundArtwork);
        } else {
          setError("Artwork not found");
        }
        setArtworkLoading(false);
      }, 300);
    };

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  return { artwork, artworkLoading, error };
}

// Orders hooks
export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //     const fetchOrders = async () => {
    //       try {
    //         const data = await getMyOrders();
    //         setOrders(data);
    //       } catch (err: any) {
    //         setError(err.response?.data?.error || "Failed to fetch orders");
    //       } finally {
    //         setOrdersLoading(false);
    //       }
    //     };

    //     fetchOrders();
    //   }, []);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setOrders(demoOrders);
      setOrdersLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { orders, ordersLoading, error };
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, ordersLoading, error };
}
