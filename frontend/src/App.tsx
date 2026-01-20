import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <MainLayout>
              <div className="text-xl font-semibold">
                Hello! <br />
                Welcome to ArtStore! <br />
                Happy Shopping~
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

