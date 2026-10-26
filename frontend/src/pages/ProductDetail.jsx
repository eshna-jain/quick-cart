import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from "../context/CartContext";
import { apiFetch } from "../api";
import { getCurrentUser } from '../utils/storage';
import Markdown from 'react-markdown';
import {BASEURL} from '../constants'


function ProductDetail({ currency = 'USD', rates}) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const updateRatingSummary = (reviewList) => {
        const validReviews = reviewList.filter((review) => review.rating !== null && review.rating !== undefined && review.rating !== "" && Number.isFinite(Number(review.rating)));
        const count = validReviews.length;
        const average = count > 0 ? validReviews.reduce((total, review) => total + Number(review.rating), 0) / count : 0;
        setProduct((prev) => prev ? { ...prev, review_count: count, average_rating: Number(average.toFixed(1)) } : prev);
    };

    const handleEditReview = async (reviewId) => {
        if (!editRating) {
            alert("Please select a rating.");
            return;
        }
        try {
            const response = await apiFetch(`/api/reviews/${reviewId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: editRating, comment: editComment })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.error || "Failed to update review.");
                return;
            }
            const updatedReviews = reviews.map((review) => review.id === reviewId ? data : review);
            setReviews(updatedReviews);
            updateRatingSummary(updatedReviews);
            setEditingReviewId(null);
            setEditRating(0);
            setEditComment("");
            alert("Review updated successfully!");
        } catch (err) {
            console.error("Review update failed:", err);
            alert("Could not update your review. Please try again.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const response = await apiFetch(`/api/reviews/${reviewId}/`, { method: "DELETE" });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(data.error || `Failed to delete review. Status: ${response.status}`);
                return;
            }
            const updatedReviews = reviews.filter((review) => review.id !== reviewId);
            setReviews(updatedReviews);
            updateRatingSummary(updatedReviews);
            if (editingReviewId === reviewId) {
                setEditingReviewId(null);
                setEditRating(0);
                setEditComment("");
            }
            alert("Review deleted successfully!");
        } catch (err) {
            console.error("Review deletion failed:", err);
            alert("Could not delete your review. Check the browser console for details.");
        }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const productResponse = await fetch(`${BASEURL}/api/products/${id}/`);
                if (!productResponse.ok) throw new Error("Failed to fetch product details.");
                const productData = await productResponse.json();
                if (isMounted) setProduct(productData);
                const reviewResponse = await fetch(`${BASEURL}/api/products/${id}/reviews/`);
                if (!reviewResponse.ok) {
                    console.error("Reviews API failed:", reviewResponse.status);
                    return;
                }
                const reviewData = await reviewResponse.json();
                if (!Array.isArray(reviewData)) {
                    console.error("Expected an array of reviews:", reviewData);
                    return;
                }
                if (isMounted) setReviews(reviewData);
            } catch (err) {
                console.error("Product details fetch failed:", err);
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [id, BASEURL]);

    const handleSubmitReview = async () => {
        if (!rating) {
            alert("Please select a rating.");
            return;
        }
        try {
            const response = await apiFetch(`/api/products/${id}/reviews/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment })
            });
            const data = await response.json();
            if (response.ok) {
                if (!data || data.id == null || data.rating == null || !Number.isFinite(Number(data.rating))) {
                    alert("The server returned an invalid review response. Please try again.");
                    return;
                }
                const updatedReviews = [data, ...reviews.filter((review) => review.id !== data.id)];
                setReviews(updatedReviews);
                updateRatingSummary(updatedReviews);
                setRating(0);
                setComment("");
                alert("Your review has been submitted successfully!");
                return;
            }
            if (response.status === 400 && typeof data.error === "string" && (data.error.toLowerCase().includes("already reviewed") || data.error.toLowerCase().includes("already submitted"))) {
                alert("You have already submitted a review for this product.");
                setRating(0);
                setComment("");
                return;
            }
            if (response.status === 401) {
                alert("Please log in to submit a review.");
                navigate("/login");
                return;
            }
            alert(data.error || "Unable to submit your review. Please try again.");
        } catch (err) {
            console.error("Review submission failed:", err);
            alert("Something went wrong while submitting your review. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>No product found</div>;
    
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <img src={product.image ? product.image.startsWith("http") ? product.image : `${BASEURL}${product.image}` : ""} alt={product.title} className="w-48 h-48 object-contain mx-auto rounded-lg mb-4" />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                        <p className='text-2xl font-semibold text-green-600 mb-6'>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: ['USD', 'EUR', 'JPY', 'INR'].includes(currency) ? currency:
                                'USD' 
                            }).format(
                                Number(product.price) * 
                                (currency == 'USD' ? 1:
                                    Number(rates?.[currency]) || 1)
                                )}
                            </p>
                        <div className='mb-6'>
                    <Markdown components= {{h1:({children}) => <h1 className='
                    text-2xl font-bold mb-3'>{children}</h1>,
                    h2:({children}) => <h2 className='
                    text-xl font-bold mb-3'>{children}</h2>,
                    h3:({children}) => <h3 className='
                    text-lg font-bold mb-2'>{children}</h3>,
                    p:({children}) => <p className='
                    mb-3 text-gray-700 leading-relaxed'>{children}</p>,
                    strong:({children}) => <strong className='
                    text-gray-900 font-bold '>{children}</strong>,
                    ul: ({children}) => <ul className='list-disc pl-6 mb-3'>{children}</ul>,
                    li: ({children}) => <li className='mb-1'>{children}</li>
                    }}>{String(product.description ?? "")}</Markdown>
                    </div>

                            
                        <button onClick={() => {
                            const token = localStorage.getItem("access_token");
                            if (!token) {
                                navigate("/login");
                                return;
                            }
                            addToCart(product);
                        }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">🛒 Add to Cart</button>

                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-5">Customer Reviews</h2>
                            <div className="mt-2">
                                {Number(product.review_count) > 0 ? (
                                    <p className="text-sm text-gray-600">
                                        <span className="text-yellow-500">{"★".repeat(Math.max(0, Math.min(5, Math.round(Number(product.average_rating) || 0))))}</span>
                                        <span className="ml-2 font-bold">{Number(product.average_rating).toFixed(1)} ({product.review_count} reviews)</span>
                                    </p>
                                ) : <p className="text-gray-500">No rating yet.</p>}
                            </div>

                            {reviews.length === 0 ? (
                                <p className="text-gray-500">No reviews yet.</p>
                            ) : reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-lg shadow mb-4">
                                    {editingReviewId === review.id ? (
                                        <>
                                            <p className="font-semibold">{review.username}
                                                {review.is_edited && <span className='
                                                text-gray-500 text-sm font-normal m-1'>(edited)
                                                </span>}
                                            </p>
                                            <div className="flex gap-1 text-2xl mb-4 mt-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button key={star} type="button" onClick={() => setEditRating(star)} className={star <= editRating ? "text-yellow-400" : "text-gray-300"}>★</button>
                                                ))}
                                            </div>
                                            <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} placeholder="Edit your review..." className="w-full border rounded-lg p-3" rows="3" />
                                            <div className="flex gap-3 mt-3">
                                                <button type="button" onClick={() => handleEditReview(review.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save Changes</button>
                                                <button type="button" onClick={() => {
                                                    setEditingReviewId(null);
                                                    setEditRating(0);
                                                    setEditComment("");
                                                }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-semibold">{review.username}
                                                {review.is_edited && <span 
                                                className='text-gray-500 text-sm font-normal m-1'>
                                                    (edited)</span>}
                                            </p>
                                            <p className="text-yellow-500">
                                                {"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                                                {"☆".repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                                            </p>
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                            {currentUser && review.user_id != null && Number(currentUser.id) === Number(review.user_id) && (
                                                <div className="flex gap-3 mt-3">
                                                    <button type="button" onClick={() => {
                                                        setEditingReviewId(review.id);
                                                        setEditRating(Number(review.rating));
                                                        setEditComment(review.comment || "");
                                                    }} className="text-blue-600 hover:underline">Edit</button>
                                                    <button type="button" onClick={() => handleDeleteReview(review.id)} className="text-red-600 hover:underline">Delete</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}

                            <div className="mt-10 bg-gray-50 p-5 rounded-xl shadow">
                                <h2 className="text-xl font-bold mb-4">Write a Review</h2>
                                <div className="flex gap-1 text-2xl mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>★</button>
                                    ))}
                                </div>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." className="w-full border rounded-lg p-3" rows="3" />
                                <button type="button" onClick={handleSubmitReview} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">Submit Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;