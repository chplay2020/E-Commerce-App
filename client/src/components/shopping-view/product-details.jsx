import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { resetProductDetails, fetchProductDetails } from "@/store/shop/products-slice/index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "sonner";
import StarRatingComponent from "@/components/common/star-rating";
import { Textarea } from "@/components/ui/textarea";

function ProductDetailsDialog({ open, setOpen, productDetails, handleAddtoCart }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            dispatch(resetProductDetails());
            setQuantity(1);
        }
    };

    const isSale = productDetails?.salePrice && Number(productDetails?.salePrice) > 0;
    const originalPrice = Number(productDetails?.price) || 0;
    const salePrice = Number(productDetails?.salePrice) || 0;
    const discount = isSale && originalPrice > salePrice
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : 0;
    const inStock = Number(productDetails?.totalStock) > 0;

    // Calculate available quantity (stock - quantity already in cart)
    const getCartItems = cartItems.items || [];
    const existingItem = getCartItems.find(item => item.productId._id === productDetails?._id);
    const currentQuantityInCart = existingItem?.quantity || 0;
    const availableQuantity = Math.max(0, productDetails?.totalStock - currentQuantityInCart);

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        });
    };

    const handleAddToCartClick = () => {
        // Validate total quantity doesn't exceed stock
        if (currentQuantityInCart + quantity > productDetails?.totalStock) {
            toast.error(
                `Only ${productDetails?.totalStock} items in stock. You already have ${currentQuantityInCart} in your cart.`
            );
            return;
        }

        // Add to cart
        handleAddtoCart(productDetails?._id, productDetails?.totalStock, quantity);
        setOpen(false);
        dispatch(resetProductDetails());
        setQuantity(1);
    };

    // Review form state
    const [ratingInput, setRatingInput] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Fetch reviews when product details change
    useEffect(() => {
        if (productDetails?._id) {
            fetchReviews();
        }
    }, [productDetails?._id]);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await axios.get(`http://localhost:5000/api/shop/review/${productDetails?._id}`);
            if (res?.data?.success) {
                setReviews(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to write a review.");
            return;
        }

        if (!reviewText || reviewText.trim().length < 5) {
            toast.error("Please write a review (at least 5 characters).");
            return;
        }

        try {
            setSubmittingReview(true);
            const payload = {
                productId: productDetails?._id,
                userId: user?.id,
                userName: user?.userName,
                reviewMessage: reviewText.trim(),
                reviewValue: Number(ratingInput)
            };

            const res = await axios.post(`http://localhost:5000/api/shop/review/add`, payload);

            if (res?.data?.success) {
                toast.success("Review submitted \u2014 thanks!");
                setReviewText("");
                setRatingInput(5);
                // Refresh product details to show updated rating and review count
                dispatch(fetchProductDetails(productDetails?._id));
                // Refresh reviews list
                fetchReviews();
            } else {
                toast.error(res?.data?.message || "Could not submit review.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Error submitting review.");
            toast.error("Error submitting review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <VisuallyHidden>
                    <DialogTitle>Product Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about {productDetails?.title}
                    </DialogDescription>
                </VisuallyHidden>

                {/* IMAGE SECTION */}
                <div className="relative">
                    <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-gray-50">
                        <img
                            src={productDetails?.image}
                            alt={productDetails?.title}
                            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm font-bold">
                                -{discount}% OFF
                            </Badge>
                        )}
                        {!inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="icon" className="flex-1">
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="flex-1">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="flex flex-col gap-6">
                    {/* Title & Rating */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                            {productDetails?.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(productDetails?.averageRating || 0)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                ({productDetails?.averageRating?.toFixed(1) || '0.0'}) {productDetails?.totalReviews || 0} reviews
                            </span>
                        </div>

                        <Badge variant="outline" className="capitalize">
                            {productDetails?.category}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Price Section */}
                    <div className="space-y-2">
                        {isSale && originalPrice > salePrice ? (
                            <>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl md:text-4xl font-bold text-red-600">
                                        {formatCurrency(salePrice)}
                                    </span>
                                    <span className="text-xl text-gray-400 line-through">
                                        {formatCurrency(originalPrice)}
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                    You save {formatCurrency(originalPrice - salePrice)}
                                </div>
                            </>
                        ) : (
                            <span className="text-3xl md:text-4xl font-bold text-gray-900">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {productDetails?.description || "No description available."}
                        </p>
                    </div>

                    {/* Stock Status */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Availability:</span>
                            <Badge variant={inStock ? "default" : "destructive"} className="font-semibold">
                                {inStock ? `${productDetails?.totalStock} in stock` : "Out of Stock"}
                            </Badge>
                        </div>
                        {currentQuantityInCart > 0 && (
                            <div className="text-sm text-orange-600 font-medium">
                                You have {currentQuantityInCart} in your cart. {availableQuantity} more available.
                            </div>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    {inStock && availableQuantity > 0 && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3"
                                >
                                    -
                                </Button>
                                <span className="px-4 py-1 min-w-[40px] text-center font-semibold">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                                    className="px-3"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                            onClick={handleAddToCartClick}
                            disabled={!inStock || availableQuantity === 0}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {availableQuantity === 0 ? "Max in Cart" : "Add to Cart"}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-12 text-base font-semibold"
                            disabled={!inStock}
                        >
                            Buy Now
                        </Button>
                    </div>

                    <Separator />

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Truck className="h-5 w-5 text-primary" />
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Shield className="h-5 w-5 text-primary" />
                            <span>1 year warranty</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <RotateCcw className="h-5 w-5 text-primary" />
                            <span>30-day return policy</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Write a Review */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">Write a review</h3>
                        <form onSubmit={submitReview} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Your rating:</span>
                                <div className="flex items-center gap-1">
                                    <StarRatingComponent
                                        rating={ratingInput}
                                        handleRatingChange={setRatingInput}
                                    />
                                </div>
                            </div>

                            <Textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="resize-none"
                                rows={4}
                                placeholder="Write your review here (min 5 characters)..."
                            />

                            <div className="flex items-center gap-3">
                                <Button type="submit" className="bg-primary" disabled={submittingReview}>
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => { setReviewText(''); setRatingInput(5); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>

                    <Separator />

                    {/* Reviews List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Customer Reviews ({reviews.length})
                        </h3>

                        {loadingReviews ? (
                            <div className="text-sm text-gray-500 py-4">Loading reviews...</div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {reviews.map((review) => (
                                    <div key={review._id} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{review.userName}</span>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-3 h-3 ${star <= review.reviewValue
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'fill-gray-200 text-gray-200'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {review.reviewMessage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 py-4 text-center border rounded-lg">
                                No reviews yet. Be the first to review this product!
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;
