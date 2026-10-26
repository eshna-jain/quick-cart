import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';


function Navbar({ currency, setCurrency }) {
    const { cartItems } = useCart();
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const location = useLocation();

    const showHomeLink = ['/login', '/register', '/profile', '/products', '/cart', '/order'].some(
        (path) => location.pathname.startsWith(path)
    ) || location.pathname.startsWith('/product/');

    const currencies = [
        { code: 'USD', label: '$ -  US Dollar' },
        { code: 'EUR', label: '€ -  Euro' },
        { code: 'JPY', label: '¥ - Japanese Yen' },
        { code: 'INR', label: '₹ - Indian Rupee' }
    ];

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed w-full top-0 left-0 z-[100]">
            <Link to="/" className="text-2xl font-bold text-gray-800">
                🛍️ₒₘₙᵢcₐᵣₜ
            </Link>

            <div className="flex items-center gap-6">
                {showHomeLink && (
                    <Link to="/" className="relative text-blue-700 hover:text-blue-500 font-medium">
                        ←Home
                    </Link>
                )}
                <Link to="/cart" className="relative text-gray-800 hover:text-gray-600 font-medium">
                    🛒Cart
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <div className="relative">
                    <button type="button" onClick={() => setCurrencyOpen((open) => !open)} className="text-gray-800 hover:text-gray-600 font-medium">
                        💵 {currency} ▼
                    </button>
                    {currencyOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2">
                            {currencies.map((currencyOption) => (
                                <button
                                    key={currencyOption.code}
                                    type="button"
                                    onClick={() => {
                                        setCurrency(currencyOption.code);
                                        setCurrencyOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    {currencyOption.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/profile" className="relative text-gray-800 hover:text-gray-600 font-medium">
                    👤Profile
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;