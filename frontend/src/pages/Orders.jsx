import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function Orders({ currency = 'USD', rates }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatPrice = (amount) => new
        Intl.NumberFormat('em-US', {
            style: 'currency',
            currency: ['USD', 'EUR', 'JPY', 'INR'].includes(currency) ? currency :
                'USD'
        }).format(Number(amount || 0) * (currency === 'USD' ? 1 : Number(rates?.[currency])
            || 1));


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiFetch("/api/orders/");
                const data = await response.json();

                console.log("ORDER RESPONSE:", data);

                if (response.ok) {
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p className='text-center mt-10'>Loading orders...</p>;
    }

    return (
        <div className='min-h-screen bg-gray-50 px-4 py-28 sm:px-6'>
            <h1 className='text-3xl font-bold text-center mb-8'>
                My Orders
            </h1>

            {orders.length === 0 ? (
                <p className='text-gray-500 text-center'>
                    You haven't placed any orders yet.
                </p>
            ) : (
                <div className='max-w-3xl mx-auto space-y-4'>
                    {orders.map((order) => (
                        <div key={order.id} className='bg-white p-5 rounded-2xl shadow-sm
                            border border-gray-100 hover:shadow-md transition '>
                            <h2 className='font-bold text-lg'>Order #{order.id}</h2>
                            <p className='text-gray-600'>Date: {" "}{order.created_at ?
                                new Date(order.created_at).toLocaleDateString("en-IN") : "N/A"}
                            </p>
                            {order.coupon_applied && (
                                <div className='mt-4 rounded-xl bg-green-50 border borden-green-100 p-4
                                space-y-3'>
                                    <h3 className='font-semibold text-green-800'>Coupon Discount Applied</h3>
                                    <div className='flex justify-between'>
                                        <span>Original Total</span>
                                        <span>{formatPrice(order.original_total)}</span>
                                    </div>
                                    <div className='flex justify-between text-green-700'>
                                        <span>Coupon savings</span>
                                        <span>-{formatPrice(order.discount_amount)}</span>
                                    </div>
                                    <div className='border-t border-green-200 pt-3 flex justify-between font-bold'>
                                        <span>Final Total</span>
                                        <span>{formatPrice(order.total_cost)}</span>
                                    </div>
                                </div>
                            )}
                            {!order.coupon_applied && (
                                <p className='font-semibold mt-2'>
                                    Total:
                                    {formatPrice(order.total_cost)}
                                </p>
                            )}
                            <p className='text-gray-600'>
                                Payment method: {{
                                    "COD": "Cash on Delivery",
                                    "CC": "Credit Card", "PP": "PayPal"
                                }[order.payment_method] || "Unknown"} </p>
                            <p className='text-gray-600'>Status: {order.is_paid ? "Paid" :
                                "Pending"} </p>

                            <div className='mt-4 border-t pt-4'>
                                <h3 className='font-semibold mb-3'>Products</h3>

                                {order.items.map((item) => (
                                    <div key={item.id} className='flex items-center gap-4 mb-3'>
                                        {console.log("image:", item.product_image)}
                                        {item.product_image && (
                                            <img
                                                src={item.product_image?.startsWith("http") ?
                                                    item.product_image : `http://127.0.0.1:8000/media/${item.product_image}`
                                                }
                                                alt={item.product_title} className='w-16 h-16 
                                                object-contain rounded' />
                                        )}

                                        <div>
                                            <p className='font-medium'>
                                                {item.product_title}
                                            </p>

                                            <p className='text-gray-600'>
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: ['USD', 'EUR', 'JPY', 'INR'].includes(currency) ? currency :
                                                        'USD'
                                                }).format(Number(item.price) * (currency === 'USD' ? 1 : Number(rates?.
                                                [currency]) || 1))} * {item.quantity}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;