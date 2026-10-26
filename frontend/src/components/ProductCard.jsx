import { Link } from 'react-router-dom';
import { BASEURL } from '../constants';

function ProductCard({ product, currency = 'USD', rates }) {
    const priceUSD = Number(product.price);
    const hasValidPrice = Number.isFinite(priceUSD) && priceUSD >= 0;
    const exchangeRate = Number(rates?.[currency]);
    const hasRate = Number.isFinite(exchangeRate) && exchangeRate > 0;
    const selectedPrice = currency === 'USD' ? priceUSD : hasRate ? priceUSD * exchangeRate : null;

    const formatPrice = (amount, currencyCode) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);

    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4">
                <img
                    src={`${BASEURL}${product.image}`}
                    alt={product.title}
                    className="w-48 h-48 object-contain mx-auto rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.title}
                </h2>
                {!hasValidPrice ? (
                    <p className="mt-2 text-red-600">Invalid product price</p>
                ) : selectedPrice === null ? (
                    <p className="mt-2 text-gray-500">Loading exchange rate...</p>
                ) : (
                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {formatPrice(selectedPrice, currency)}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default ProductCard;