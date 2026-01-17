import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <div className="text-xl font-semibold">
          Hello! <br />
          Welcome to ArtStore! <br />
          Happy Shopping~
        </div>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
