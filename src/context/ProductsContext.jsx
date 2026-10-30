import { createContext, useContext, useState } from "react";
import { products as sampleProducts } from "../data/products.js";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [dealerProducts, setDealerProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dealerProducts")) || [];
    } catch {
      return [];
    }
  });

  // Returns false if the browser storage is full
  const persist = (list) => {
    try {
      localStorage.setItem("dealerProducts", JSON.stringify(list));
      setDealerProducts(list);
      return true;
    } catch {
      return false;
    }
  };

  const addProduct = (product) => persist([{ ...product, id: Date.now() }, ...dealerProducts]);

  const updateProduct = (id, changes) =>
    persist(dealerProducts.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const deleteProduct = (id) => persist(dealerProducts.filter((p) => p.id !== id));

  const products = [...dealerProducts, ...sampleProducts];

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);