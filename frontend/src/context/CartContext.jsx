import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { BASEURL } from '../constants';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const total = cartItems.reduce((sum, item) => sum + Number(item.product_price)
        * item.quantity, 0);


    useEffect(() => {
        const handleAuthChange = () => {
            if (localStorage.getItem('access_token')) {
                fetchCart();
            } else {
                clearCart();
            }
        };

        handleAuthChange();
        window.addEventListener('authChanged', handleAuthChange);

        return () => {
            window.removeEventListener('authChanged', handleAuthChange);
        };
    }, []);

    const fetchCart = async () => {
        try {
            const res = await apiFetch("/api/cart/");

            console.log("CART STATUS:", res.status);

            if (!res.ok) {
                throw new Error("Failed to fetch cart.");
            }

            const text = await res.text();
            console.log("CART RESPONSE:", text);

            const data = JSON.parse(text);
            setCartItems(data);

            const cartTotal = data.reduce((sum, item) => sum + Number(item.product_price)
                * item.quantity, 0);
            // setTotal(cartTotal);

        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };
    const addToCart = async (product) => {
        try {
            const res = await apiFetch("/api/cart/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: product.id,
                }),
            });

            if (!res.ok) {
                console.error("Failed to add item:", await res.text());
                return;
            }

            fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await apiFetch("/api/cart/remove/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item_id: itemId,
                }),
            });

            if (!res.ok) {
                console.error("Failed to remove item:", await res.text());
                return;
            }

            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        try {
            const res = await apiFetch("/api/cart/update/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item_id: itemId,
                    quantity,
                }),
            });

            if (!res.ok) {
                console.error("Failed to update quantity:", await res.text());
                return;
            }

            fetchCart();
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        // setTotal(0);


    }


    return (
        <CartContext.Provider
            value={{ cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);


