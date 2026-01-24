import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";


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
                  path="/*"
                  element={
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/collection" element={<CollectionPage />} />
                        <Route path="/artwork/:slug" element={<ProductDetailsPage />} />
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
                              <ProfilePage />
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

