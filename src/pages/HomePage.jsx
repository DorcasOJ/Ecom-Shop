import React from "react";
import { NavBar } from "../features/navigation/components/Navbar";
import { ProductList } from "../features/products/components/ProductList";
import { Footer } from "../features/footer/Footer";

export const HomePage = () => {
  return (
    <>
      <NavBar isProductList={true} />
      <ProductList />
      <Footer />
    </>
  );
};
