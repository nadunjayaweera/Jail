import { createContext, useContext, useState } from "react";

const CartCtx = createContext();

export function CartCtxProvider({children}) {
    const [cartData, setCartData] = useState([]);

    console.log("cartData - ", cartData)

    const setCartDataHandler = (data) => {
        setCartData((prevData) => {
          const existingItem = prevData.find((item) => item.name === data.name);
      
          if (existingItem) {
            // If the item already exists in the cart, increase its quantity by 1 or the specified quantity
            const updatedData = prevData.map((item) =>
              item.name === data.name
                ? { ...item, quantity: item.quantity + (data.quantity || 1) }
                : item
            );
            return updatedData;
          } else {
            // If the item doesn't exist in the cart, add it as a new object with a quantity of 1 or the specified quantity
            const newItem = { ...data, quantity: data.quantity || 1 };
            return [...prevData, newItem];
          }
        });
    };
    
    const incrementCartItem = (itemName, incrementBy = 1) => {
      setCartData((prevData) => {
        const updatedData = prevData.map((item) =>
          item.name === itemName
            ? { ...item, quantity: item.quantity + incrementBy }
            : item
        );
        return updatedData;
      });
    };
    const decrementCartItem = (itemName, decrementBy = 1) => {
  setCartData((prevData) => {
    const updatedData = prevData.map((item) =>
      item.name === itemName
        ? { ...item, quantity: Math.max(item.quantity - decrementBy, 0) }
        : item
    );
    return updatedData.filter((item) => item.quantity > 0); // Remove items with quantity 0
  });
};

    const resetCart = () => {
      setCartData([]);
    }
      

    return (
        <CartCtx.Provider value={{
            cartData,
            setCartDataHandler,
            incrementCartItem,
            decrementCartItem,
            resetCart
        }}>
            {children}
        </CartCtx.Provider>
    )
}

export function useCartCtx() {
    return useContext(CartCtx);
}