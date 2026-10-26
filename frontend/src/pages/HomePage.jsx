import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import {BASEURL} from '../constants';


function HomePage({ currency, rates }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

useEffect(() => {
    fetch(`${BASEURL}/api/categories/`)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((data) => {
            setCategories(Array.isArray(data) ? data : data?.results || []);
        })
        .catch((error) => console.error("Categories error:", error));

    fetch(`${BASEURL}/api/products/`)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((data) => setProducts(Array.isArray(data) ? data : data?.results || []))
        .catch((error) => console.error("Products error:", error));
}, []);

    const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes (search.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(search.toLowerCase())
)

    return (
        <div className="min-h-screen bg-gray-100 pt-20">
            <section className="bg-white py-12 px-6">
                <h1 className="text-4xl font-bold text-center">
                    Welcome to OmniCart
                </h1>

                <p className="text-center text-gray-600 mt-3">
                    Shop everything you need in one place.
                </p>
            </section>
            <SearchBar onSearch={setSearch} />

            <section className="py-10 px-6">
                <h2 className="text-2xl font-bold mb-6">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
            </section>

            <section className='mt-10 px-6 mb-8'>
                <h2 className='text-2xl font-bold mb-6'>
                    Featured Products </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {products.filter((product) => product.title.toLowerCase().includes(search.toLowerCase())
                     ).slice(0, 5).map((product) => ( <ProductCard key={product.id} product={product}
                        currency={currency} rates={rates} />
                    ))}
                </div>
            </section>

            <section className='mt-8 px-6 pb-16'>
                <h2 className='text-2xl font-bold text-center mb-5'>
                    Why shop with OmniCart </h2>
                
                <div className='max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <div className='bg-white p-6 rounded-xl shadow text-center'>
                        <div className='text-3xl mb-3'>🚚</div>
                        <h3 className='font-bold text-lg'>Fast Delivery</h3>
                        <p className='text-gray-500 text-sm mt-2'>
                            Get your orders delivered quickly.
                        </p>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow text-center'>
                        <div className='text-3xl mb-3'>🔒</div>
                        <h3 className='font-bold text-lg'>Secure Shopping</h3>
                        <p className='text-gray-500 text-sm mt-2'>
                            Your shopping experience stays safe. </p>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow text-center'>
                        <div className='text-3xl mb-3'>❤️</div>
                        <h3 className='font-bold text-lg'>Quality Products</h3>
                        <p className='text-gray-500 text-sm mt-2'>
                            Product you'll love at great prices. </p>
                    </div>


                    <div className='bg-white p-6 rounded-xl shadow text-center'>
                        <div className='text-3xl mb-3'>💳</div>
                        <h3 className='font-bold text-lg'>Easy Checkout</h3>
                        <p className='text-gray-500 text-sm mt-2'>
                            Simple and hassle-free ordering. </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
