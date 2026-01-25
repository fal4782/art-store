import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/profile/OrderDetailsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminLayout from "./layout/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminArtworkAdd from "./pages/admin/AdminArtworkAdd";
import AdminArtworkEdit from "./pages/admin/AdminArtworkEdit";
import AdminDiscounts from "./pages/admin/AdminDiscounts";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminLayout>
                        <Routes>
                          <Route index element={<AdminOverview />} />
                          <Route path="/artworks" element={<AdminArtworks />} />
                          <Route
                            path="/artworks/add"
                            element={<AdminArtworkAdd />}
                          />
                          <Route
                            path="/artworks/edit/:id"
                            element={<AdminArtworkEdit />}
                          />
                          <Route
                            path="/discounts"
                            element={<AdminDiscounts />}
                          />
                          <Route path="*" element={<AdminOverview />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route
                          path="/collection"
                          element={<CollectionPage />}
                        />
                        <Route
                          path="/artwork/:slug"
                          element={<ProductDetailsPage />}
                        />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile/*"
                          element={
                            <ProtectedRoute>
                              <Routes>
                                <Route path="/" element={<ProfilePage />} />
                                <Route
                                  path="/orders/:id"
                                  element={<OrderDetailsPage />}
                                />
                                <Route path="*" element={<ProfilePage />} />
                              </Routes>
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </MainLayout>
                  }
                />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
