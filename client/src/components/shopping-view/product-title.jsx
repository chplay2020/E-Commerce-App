import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { categoryOptionMap, brandOptionMap } from "@/config/index";

function ShoppingProductTitle({ product, handleGetProductDetails, handleAddtoCart }) {
    const isSale = Number(product?.salePrice) > 0;
    const priceNum = Number(product?.price) || 0;
    const saleNum = Number(product?.salePrice) || 0;
    const savedPrice = Math.max(0, priceNum - saleNum);
    const salePercent = isSale && priceNum > 0 ? Math.round((savedPrice / priceNum) * 100) : 0;
    const inStock = Number(product?.totalStock) > 0;

    // Get actual rating data from product
    const rating = product?.averageRating || 0;
    const reviewCount = product?.totalReviews || 0;

    const formatCurrency = (v) => {
        const n = Number(v || 0);
        return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
    };

    // Validate price data to prevent unrealistic discounts
    const isValidPrice = priceNum > 0 && saleNum > 0 && priceNum > saleNum;

    return (
        <Card className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full group/card">
            {/* Clickable area for product details - chỉ ảnh và content */}
            <div
                className="flex-1 flex flex-col cursor-pointer"
                onClick={() => handleGetProductDetails(product?._id)}
            >
                {/* Image Container - Tỉ lệ 4:5 gọn hơn */}
                <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover/card:scale-110"
                    />

                    {/* SALE Badge - Top Left */}
                    {isSale && isValidPrice && salePercent > 0 && product?.totalStock > 0 && (
                        <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg z-10">
                            -{salePercent}%
                        </div>
                    )}

                    {/* Out of Stock Badge - Top Left */}
                    {product?.totalStock === 0 && (
                        <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg z-10">
                            Out of Stock
                        </div>
                    )}

                    {/* Low Stock Badge - Bottom Left */}
                    {product?.totalStock > 0 && product?.totalStock < 10 && (
                        <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg z-10">
                            Only {product?.totalStock} left!
                        </div>
                    )}
                </div>

                {/* Content - Padding nhỏ hơn, gọn hơn */}
                <CardContent className="p-3 flex-1 flex flex-col space-y-2">
                    {/* Product Title - Font lớn hơn và đậm hơn */}
                    <h2 className="font-bold text-gray-900 leading-tight line-clamp-2 text-base group-hover/card:text-primary transition-colors">
                        {product?.title}
                    </h2>

                    {/* Rating & Reviews - Gọn hơn */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= Math.floor(rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">({reviewCount})</span>
                    </div>

                    {/* Category & Brand - Thu gọn */}
                    <p className="text-xs text-gray-500">
                        {categoryOptionMap[product?.category]} · {brandOptionMap[product?.brand]}
                    </p>

                    {/* Price Section - Màu sắc nổi bật hơn */}
                    <div className="mt-auto pt-2">
                        {isSale && isValidPrice ? (
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-red-600">
                                        {formatCurrency(product?.salePrice)}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatCurrency(product?.price)}
                                    </span>
                                </div>
                                <div className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                                    Save {formatCurrency(savedPrice)}
                                </div>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-gray-900">
                                {formatCurrency(product?.price || product?.salePrice)}
                            </span>
                        )}
                    </div>
                </CardContent>
            </div>

            {/* Add to Cart Button - Full width với hover đẹp */}
            <CardFooter className="p-2.5 pt-0">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddtoCart(product?._id, product?.totalStock);
                    }}
                    className={`w-full h-9 text-xs font-bold transition-all duration-200 ${inStock
                        ? "bg-primary hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={!inStock}
                >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTitle;