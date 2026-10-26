import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { saveCurrentUser } from '../utils/storage';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {BASEURL} from '../constants';


function Login() {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const login = async (formData) => {
        console.log("LOGIN BU")
        setError("");

        const response = await fetch(`${BASEURL}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            }),
        });

        console.log(formData.username, formData.password);

        const data = await response.json();
        console.log("LOGIN RESPONSE:", response.status, data);

        if (!response.ok) {
            setError(data.non_field_errors?.[0] ||

            data.detail || "Invalid username or password");
            return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        saveCurrentUser(data.user);
        window.dispatchEvent(new Event("authChanged"));

        reset();

        navigate("/");

        console.log(data);
    };



    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-white'>
        <div className='py-4 px-4 md:px-8 w-full'>
            <div className='max-w-6xl w-full mx-auto'>
                <div className='border border-slate-300 rounded-lg p-6 w-full max-w-lg mx-auto shadow-sm md:p-8 bg-white'>
                    
                    <div className='mb-8'>
                        <h1 className='text-slate-900 text-3xl font-bold '>Sign In</h1>
                        <p className='text-slate-600 text-base leading-relaxed'>Sign in to continue shopping </p>
                    </div>

                    <form onSubmit={handleSubmit(login)} className='space-y-6'>
                        <div>
                            <label htmlFor='username' className='mb-2 text-slate-900 font-medium text-sm inline-block '>Username</label>
                            <input type='text' id='username'{...register('username')} name='username' placeholder='felix123' required
                            className='px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2
                            focus:outline-blue-600 ' />
                        </div>

                        <div>
                            <label htmlFor='password' className='mb-2 text-slate-900 font-medium text-sm inline-block '>Password</label>
                            <input type='password' id='password'{...register('password')} name='password' placeholder='••••••••' required
                            className='px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2
                            focus:outline-blue-600 ' />
                        </div>
                        {error && <p style={{ color: "#ff474c"}}>{error}</p>}

                        <button type='submit' className='w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 
                        bg-blue-600 hover:bg-blue-700 transition-all '>
                            Sign In</button>

                        <div className='text-slate-900 text-sm text-center '>Don't have an account?{" "}
                            <Link to='/register' className='text-blue-700 hover:underline ml-1 font-medium'>
                                Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
)
}

export default Login;