import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tag, ShoppingCart } from "lucide-react";
import { categoryOptionMap, brandOptionMap } from "@/config/index";


function ShoppingProductTitle({ product }) {
    const isSale = Number(product?.salePrice) > 0;
    const priceNum = Number(product?.price) || 0;
    const saleNum = Number(product?.salePrice) || 0;
    const savedPrice = Math.max(0, priceNum - saleNum);
    const salePercent = isSale && priceNum > 0 ? Math.round((savedPrice / priceNum) * 100) : 0;
    const inStock = Number(product?.totalStock) > 0;
    const formatCurrency = (v) => {
        const n = Number(v || 0);
        return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
    };

    return (
        <Card className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg flex flex-col h-full">
            <div className="group flex-1 flex flex-col">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-3/4 bg-gray-100">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />

                    {/* SALE Badge - Nổi bật hơn */}
                    {isSale && (
                        <div className="absolute top-3 left-3 bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                            Sale {salePercent}%
                        </div>
                    )}
                </div>

                {/* Content - flex-1 để chiếm không gian còn lại */}
                <CardContent className="p-4 flex-1 flex flex-col">
                    {/* Product Title - chiều cao cố định */}
                    <h2 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-base h-12 mb-2">
                        {product?.title}
                    </h2>

                    {/* Category & Brand */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                        <span className="capitalize">{categoryOptionMap[product?.category]}</span>
                        <span className="text-gray-300">•</span>
                        <span className="capitalize">{brandOptionMap[product?.brand]}</span>
                    </div>

                    {/* Price Section - luôn ở cuối content */}
                    <div className="mt-auto">
                        {isSale ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-red-600">
                                        {formatCurrency(product?.salePrice)}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatCurrency(product?.price)}
                                    </span>
                                </div>
                                <div className="inline-block bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
                                    Save {formatCurrency(savedPrice)}
                                </div>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(product?.price)}
                            </span>
                        )}
                    </div>
                </CardContent>

                {/* Add to Cart Button - cố định ở dưới cùng */}
                <CardFooter className="p-3 pt-0">
                    <Button
                        className="w-full h-10 text-sm font-semibold bg-primary hover:bg-primary/90 shadow-sm"
                        disabled={!inStock}
                    >
                        <ShoppingCart className="size-4 mr-2" />
                        {inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                </CardFooter>
            </div>
        </Card>
    )
}

export default ShoppingProductTitle;