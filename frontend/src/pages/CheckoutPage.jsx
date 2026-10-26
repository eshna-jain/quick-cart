import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponAvailable, setCouponAvailable] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        payment_method: 'COD',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await apiFetch('/api/coupon/');
                if (!res.ok) {
                    setCouponAvailable(false);
                    return;
                }
                const data = await res.json();
                setCouponAvailable(Boolean(data.coupon));
            } catch (error) {
                console.error('Failed to fetch coupon:', error);
            }
        };
        fetchCoupon();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await apiFetch('/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    address: form.address,
                    phone: form.phone,
                    payment_method: form.payment_method,
                    coupon_code: couponAvailable ? couponCode.trim() : '',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'Failed to place order. Please try again.');
                return;
            }

            setMessage('Order placed successfully!');
            setCouponAvailable(false);
            setCouponCode('');
            clearCart();

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Checkout error:', error);
            setMessage('An error has occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Name" value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <textarea
                        name="address"
                        placeholder="Full Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="CC">Credit Card</option>
                        <option value="PP">PayPal</option>
                    </select>

                    {couponAvailable && (
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Welcome Coupon
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="w-full border rounded-lg p-2"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Get 10% off your first order
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>

                    {message && (
                        <p className={`text-center font-semibold mt-4 ${
                            message === 'Order placed successfully!'
                                ? 'text-green-700'
                                : 'text-red-600'
                        }`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CheckoutPage;