import { createContext, useContext, useState } from "react";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      return [];
    }
  });

  const placeOrders = (newOrders) => {
    const list = [...newOrders, ...orders];
    setOrders(list);
    try {
      localStorage.setItem("orders", JSON.stringify(list));
    } catch {
      /* storage full */
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);