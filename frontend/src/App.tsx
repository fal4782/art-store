import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        {/* Your page content or <Routes> will go here */}
        <div className="text-center mt-8 text-xl font-semibold">
          Welcome to ArtStore!
        </div>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
