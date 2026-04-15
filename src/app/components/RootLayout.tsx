import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Outlet />
    </div>
  );
}