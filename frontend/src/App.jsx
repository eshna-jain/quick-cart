import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import withAuth from './hoc/withAuth';
import CurrencyConvertor from './pages/CurrencyConvertor';
import Welcome from './pages/Welcome';

const ProtectedCheckOut = withAuth(CheckoutPage);
const ProtectedProfile = withAuth(Profile);
const ProtectedOrders = withAuth(Orders);

function App() {
    const [currency, setCurrency] = useState('USD');
    const [rates, setRates] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD');
                const data = await response.json();

                if (!response.ok || data.result !== 'success') {
                    throw new Error(data['error-type'] || `HTTP ${response.status}`);
                }

                setRates(data.conversion_rates);
                console.log('Exchange rates loaded:', data.conversion_rates);
            } catch (error) {
                console.error('Exchange rates error:', error.message);
            }
        };

        fetchRates();

    }, []);

    return (
        <Router>
            <Navbar currency={currency} setCurrency={setCurrency} />
            <Routes>
                <Route path='/product/:id' element={<ProductDetail currency={currency} rates={rates} />} />
                <Route path='/cart' element={<CartPage currency={currency} rates={rates} />} />
                <Route path='/checkout' element={<ProtectedCheckOut />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/terms' element={<Terms />} />
                <Route path='/products' element={<ProductList currency={currency} rates={rates} />} />
                <Route path='/' element={<HomePage currency={currency} rates={rates} />} />
                <Route path='/profile' element={<ProtectedProfile />} />
                <Route path='/orders' element={<ProtectedOrders currency={currency} rates={rates} />} />
                <Route path='/currencyconvertor' element={<CurrencyConvertor />} />
                <Route path='/welcome' element={<Welcome />} />
            </Routes>
        </Router>
    );

}

export default App;
