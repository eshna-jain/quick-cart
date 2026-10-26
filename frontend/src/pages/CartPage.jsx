import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { BASEURL } from "../constants";

function CartPage({ currency = "USD", rates = {} }) {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const supportedCurrencies = ["USD", "EUR", "JPY", "INR"];
    const selectedCurrency = supportedCurrencies.includes(currency) ? currency : "USD";
    const rate = selectedCurrency === "USD" ? 1 : Number(rates[selectedCurrency]) || 1;
    const formatPrice = (price) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: selectedCurrency
    }).format(Number(price) * rate);

    return (
        <div className="pt-20 min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your Cart is empty.</p>
            ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-4">
                                    {item.product_image && (
                                        <img src={`${BASEURL}${item.product_image}`} alt={item.product_title} className="w-20 h-20 object-cover rounded" />
                                    )}
                                </div>
                                <h2 className="text-lg font-semibold">{item.product_title}</h2>
                                <p className="text-gray-600">{formatPrice(item.product_price)}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button className="text-red-500" onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="border-t pt-4 mt-4 flex justify-between items-center gap-4">
                        <h2 className="text-xl font-bold">Total:</h2>
                        <p className="text-xl font-semibold">{formatPrice(total)}</p>
                        <Link to="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Ready to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;