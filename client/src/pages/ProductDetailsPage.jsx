import { Footer } from "../features/footer/Footer";
import { NavBar } from "../features/navigation/components/Navbar";
import { ProductDetails } from "../features/products/components/ProductDetails";

export const ProductDetailsPage = () => {
  return (
    <>
      <NavBar />
      <ProductDetails />
      <Footer />
    </>
  );
};
