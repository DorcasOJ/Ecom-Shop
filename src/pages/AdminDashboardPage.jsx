import { AdminDashBoard } from "../features/admin/components/AdminDashboard";
import { NavBar } from "../features/navigation/components/Navbar";

export const AdminDashboardPage = () => {
  return (
    <>
      <NavBar isProductList={true} />
      <AdminDashBoard />
    </>
  );
};
