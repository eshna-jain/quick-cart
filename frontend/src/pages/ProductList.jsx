import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { BASEURL } from '../constants';
import SearchBar from '../components/SearchBar';

function ProductList({ currency, rates}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';


    useEffect(() => {
        fetch(`${BASEURL}/api/products/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products.');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    
    const filteredProducts = products.filter((product) =>
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="p-6">Loading products...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-6 shadow-md">
                <h1 className="text-3xl font-bold">
                    Our Products List
                </h1>

            </div>
            <SearchBar />

            
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currency={currency}
                            rates={rates}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center">
                        No products found.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductList;
