import { Link } from 'react-router-dom';


function Terms() {


    return (
        <div className='min-h-screen bg-white text-slate-900'>
            <div className='max-w-4xl mx-auto px-6 py-12'>

                <h1 className='text-4xl font-bold mt-8 mb-3'> Terms & Conditions </h1>
                <p className='text-slate-500 mb-10'>
                    LAST UPDATED: October 2026
                </p>

                <section className='space-y-8'>
                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            1. Acceptance of Terms </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            By using OmniCart, you agree to these Terms & Conditions. If you do not agree
                            with these terms, please do not use the website. </p>
                    </div>

                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            2. User Accounts </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            You are responsible for providing accurate
                            information when creating an account and for
                            keeping your login credentials secure. You are
                            responsible for activities performed through your account.
                        </p>
                    </div>

                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            3. Products and Prices </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            Product information, availability, images, and
                            prices may change without notice. We try to keep
                            product information accurate, but we do not
                            guarantee that every detail will always be
                            completely error-free.
                        </p>
                    </div>

                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            4. Orders  </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            Placing an order does not guarantee that the order
                            will be fulfilled. We reserve the right to cancel
                            or reject an order when necessary, including in
                            cases of incorrect pricing, unavailable products,
                            or suspected misuse.
                        </p>
                    </div>

                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            5. Payments  </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            Available payment methods are displayed during
                            checkout. You agree to provide valid payment
                            information when required
                        </p>
                    </div>

                    <div>
                        <h2 className='text-2xl font-semibold mb-3'>
                            6. Contact  </h2>
                        <p className='text-slate-600 leading-relaxed'>
                            If you have questions about these Terms &
                            Conditions, please contact the OmniCart
                            administrator.
                        </p>
                    </div>
                    <Link to='/register' className='text-blue-600 hover:underline'>
                        ← Back to Register </Link>
                </section>
            </div>
        </div>
    );
}

export default Terms;




