import { Route } from "react-router";
import { Routes } from "react-router";
import Home from "./pages/home";
import "./App.css";
import Create from "./pages/create";
import Subindex from "./pages/subindex";
import Playground from "./pages/playground";

function App() {
  return (
    <div className="bg-black text-white px-4 md:px-20 text-sm">
      <Routes>
        <Route index element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="subindex/:id" element={<Subindex />} />
        <Route path="playground" element={<Playground />} />
      </Routes>
    </div>
  );
}

export default App;
