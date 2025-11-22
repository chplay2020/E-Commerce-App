import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { resetProductDetails } from "@/store/shop/products-slice/index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

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

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">

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
                                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">(4.5) 128 reviews</span>
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
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Availability:</span>
                        <Badge variant={inStock ? "default" : "destructive"} className="font-semibold">
                            {inStock ? `${productDetails?.totalStock} in stock` : "Out of Stock"}
                        </Badge>
                    </div>

                    {/* Quantity Selector */}
                    {inStock && (
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
                                    onClick={() => setQuantity(Math.min(productDetails?.totalStock, quantity + 1))}
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
                            disabled={!inStock}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
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
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;
