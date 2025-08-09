import { Route, Routes } from "react-router";
import { DiffPage } from "./pages/diff";
import { Layout } from "./pages/layout";
import { SyncPage } from "./pages/sync";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DiffPage />} />
        <Route path="/sync" element={<SyncPage />} />
      </Route>
    </Routes>
  );
}
