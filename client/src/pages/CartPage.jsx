import { Cart } from "../features/cart/components/Cart";
import { Footer } from "../features/footer/Footer";
import { NavBar } from "../features/navigation/components/Navbar";

export const CartPage = () => {
  return (
    <>
      <NavBar />
      <Cart />
      <Footer />
    </>
  );
};
