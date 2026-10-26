import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("loggedInUser");
        setUser(null);
        navigate("/");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-28">
            <div className="max-w-2xl mx-auto">
                <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-100/50'>
                    <div className='h-32 bg-gradient-to-r from-sky-400 to-indigo-400'>
                    </div>
                    <div className='px-6 pb-8 sm:px-10'>
                        <div className='-mt-12 mb-5 flex items-end justify-between'>
                            <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-white
                        bg-blue-100 text-4xl font-bold uppercase text-blue-700 shadow-md'>
                                {user.username?.charAt(0) || 'U'}
                            </div>
                            <span className='mb-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium 
                            text-green-700'>  ● Active </span>
                        </div>

                        <h1 className='tetx-3xl font-bold tracking-tight text-gray-500'>
                            My Profile </h1>
                        <p className='mt-2 text-gray-500'>
                            Welcome back, {user.username}! </p>
                        <div className="mt-8 space-y-4">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">Username</p>
                                <p className="mt-1 break-words font-semibold text-gray-900">
                                    {user.username}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">Email address</p>
                                <p className="mt-1 break-words font-semibold text-gray-900">
                                    {user.email || 'No email provided'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Link
                                to="/orders"
                                className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
                            >
                                <span>🛍️</span> My Orders
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <span>↪️</span> Logout
                            </button>
                        </div>

                        <p className="mt-6 text-center text-xs text-gray-400">
                            Thank you for shopping with OmniCart ♡
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

