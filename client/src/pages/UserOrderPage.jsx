import { Footer } from "../features/footer/Footer";
import { NavBar } from "../features/navigation/components/Navbar";
import { UserOrders } from "../features/order/components/UserOrders";

export const UserOrderPage = () => {
  return (
    <>
      <NavBar />
      <UserOrders />
      <Footer />
    </>
  );
};
