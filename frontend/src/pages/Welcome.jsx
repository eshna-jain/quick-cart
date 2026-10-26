import { useLocation, useNavigate } from 'react-router-dom';

function Welcome() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6 text-center'>
            <h1 className='text-3xl font-bold'>Hii , Welcome {state?.username}!</h1>
            <p className='mt-3 text-gray-600'>Here's your welcome gift!🎁 </p>
            <div className='mt-6 rounded-xl bg-white p-8 shadow-lg'>
                <h2 className='text-xl font-bold text-pink-600'>10% OFF </h2>
                <p className='mt-2'>Your Coupon Code: </p>
                <h3 className='mt-2 text-2xl font-bold'>{state?.couponCode} </h3>
                <p className='mt-2 text-sm text-gray-500'> Minimum Order: $7.95 USD </p>
             </div>

            <button onClick={() => navigate('/login')} className='mt-6 rounded-lg bg-blue-600 px-6 py-3
            text-white'>
                Start Shopping! </button>
        </div>
    );    
}

export default Welcome;