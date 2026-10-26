import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {BASEURL} from '../constants'


function Register() {
    
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const registerUser = async (formData) => {
        if (!acceptedTerms) {
            setError("terms", {
                type: "manual",
                message: "Please accept the Terms & Conditions.",
            });
            return;
        }

        if (formData.password !== formData.rePassword) {
            setError("rePassword", {
                type: "manual",
                message: "Password must match.",
            });
            return;
        }

        try {
            const response = await fetch(`${BASEURL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.email) {
                    setError("email", {
                        type: "server",
                        message: data.email[0],
                    });
                }
                if (data.username) {
                    setError("username", {
                        type: "server",
                        message: data.username[0],
                    });
                }
                if (data.password) {
                    setError("password", {
                        type: "server",
                        message: data.password[0],
                    });
                }
                return;
            }

            reset();
            setAcceptedTerms(false);
            navigate("/welcome", {
                state: {
                    username: formData.username,
                    couponCode: data.coupon_code
                }
            });
            
        } catch (error) {
            setError("root", {
                type: "server",
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <main className="px-4 md:px-8 min-h-screen pt-24 flex flex-col items-center justify-center bg-white">
            <div className="max-w-md w-full">
                <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-sm md:p-6">
                    <h1 className="text-slate-900 text-center text-2xl font-bold">
                        Create an account
                    </h1>

                    <form
                        className="space-y-6 mt-10"
                        onSubmit={handleSubmit(registerUser)}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                placeholder="john@readymadeui.com"
                                required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}

                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username")}
                                placeholder="felix123"
                                required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                            />
                        </div>

                        {errors.username && (
                            <p className="text-red-500 text-sm">{errors.username.message}</p>
                        )}

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password")}
                                placeholder="••••••••"
                                required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                            />
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                {...register("rePassword")}
                                placeholder="••••••••"
                                required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                            />
                        </div>

                        {errors.rePassword && (
                            <p className="text-red-500 text-sm">{errors.rePassword.message}</p>
                        )}

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1"
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm text-slate-600"
                            >
                                I agree to the{" "}
                                <Link
                                    to="/terms"
                                    className="text-blue-600 hover:underline"
                                >
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        {errors.terms && (
                            <p className="text-red-500 text-sm">{errors.terms.message}</p>
                        )}

                        {errors.root && (
                            <p className="text-red-500 text-sm text-center">
                                {errors.root.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Create an account
                        </button>
                    </form>

                    <div className="mt-6 text-slate-900 text-sm text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-700 hover:underline ml-1 font-medium"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;