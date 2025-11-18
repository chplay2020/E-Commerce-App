import { Card, CardContent, CardFooter } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Pencil, Trash2, Tag } from "lucide-react";
import { ShoppingCart } from 'lucide-react'; // hoặc thư viện icon bạn dùng

function AdminProductTitle({
    product,
    setFormData,
    setOpenCreateProductDialog,
    setCurrentEditedId,
    handleDelete
}) {
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
        // <Card
        //     className={`w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 hover:-translate-y-1 bg-white ${isSale ? "border-red-200" : "border-gray-200"
        //         }`}
        // >
        //     <div className="group">

        //         {/* Image */}
        //         <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        //             <img
        //                 src={product?.image}
        //                 alt={product?.title}
        //                 className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        //             />

        //             {/* SALE Badge */}
        //             {isSale && (
        //                 <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow flex items-center gap-1">
        //                     <Tag className="size-3.5" />
        //                     {`SALE${salePercent ? ` • ${salePercent}%` : ""}`}
        //                 </div>
        //             )}

        //             {/* Quick actions */}
        //             <div className="absolute top-3 right-3 hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        //                 <Button
        //                     size="icon"
        //                     variant="ghost"
        //                     className="rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        //                     onClick={() => {
        //                         setOpenCreateProductDialog(true);
        //                         setCurrentEditedId(product?._id);
        //                         setFormData(product);
        //                     }}
        //                 >
        //                     <Pencil className="size-4" />
        //                 </Button>

        //                 <Button
        //                     size="icon"
        //                     variant="ghost"
        //                     className="rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        //                     onClick={() => handleDelete(product?._id)}
        //                 >
        //                     <Trash2 className="size-4" />
        //                 </Button>
        //             </div>

        //             {/* Beautiful gradient overlay */}
        //             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
        //         </div>

        //         {/* Content */}
        //         <CardContent className="p-6 space-y-4 bg-white">

        //             {/* Title */}
        //             <h2 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug line-clamp-2 min-h-[3rem] transition-colors group-hover:text-primary">
        //                 {product?.title}
        //             </h2>

        //             {/* Meta badges */}
        //             <div className="flex flex-wrap items-center gap-2 pt-1">
        //                 {product?.category && (
        //                     <Badge className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs shadow-sm border border-gray-200 capitalize">
        //                         {product.category}
        //                     </Badge>
        //                 )}
        //                 {product?.brand && (
        //                     <Badge
        //                         variant="outline"
        //                         className="px-3 py-1 rounded-full text-xs border-gray-300 shadow-sm capitalize"
        //                     >
        //                         {product.brand}
        //                     </Badge>
        //                 )}

        //                 {/* Stock */}
        //                 <div className="ml-auto">
        //                     <Badge
        //                         className={`px-3 py-1 text-xs rounded-full shadow-sm ${inStock
        //                             ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        //                             : "bg-red-100 text-red-700 border border-red-300"
        //                             }`}
        //                     >
        //                         {inStock ? `Stock: ${product?.totalStock}` : "Out of stock"}
        //                     </Badge>
        //                 </div>
        //             </div>

        //             {/* Divider */}
        //             <div className="border-b mt-1 mb-2 border-gray-100"></div>

        //             {/* Description */}
        //             {product?.description && (
        //                 <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        //                     {product.description}
        //                 </p>
        //             )}

        //             {/* Price Section */}
        //             <div className="flex items-end justify-between pt-1">
        //                 <div className="flex items-center space-x-2">

        //                     {/* Original price */}
        //                     <span
        //                         className={
        //                             isSale
        //                                 ? "line-through text-gray-400 text-sm"
        //                                 : "text-2xl font-semibold text-gray-900"
        //                         }
        //                     >
        //                         {formatCurrency(product?.price)}
        //                     </span>

        //                     {/* Sale price */}
        //                     {isSale && (
        //                         <span className="text-2xl font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg shadow-sm">
        //                             {formatCurrency(product?.salePrice)}
        //                         </span>
        //                     )}
        //                 </div>

        //                 {/* Save */}
        //                 {isSale && (
        //                     <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 shadow-sm">
        //                         Save {formatCurrency(savedPrice)}
        //                     </span>
        //                 )}
        //             </div>
        //         </CardContent>

        //         {/* Mobile Actions */}
        //         <CardFooter className="p-5 pt-0 flex justify-between gap-3 border-t md:hidden bg-gray-50">
        //             <Button
        //                 onClick={() => {
        //                     setOpenCreateProductDialog(true);
        //                     setCurrentEditedId(product?._id);
        //                     setFormData(product);
        //                 }}
        //                 variant="outline"
        //                 className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        //             >
        //                 <Pencil className="size-4 mr-2" /> Edit
        //             </Button>
        //             <Button
        //                 onClick={() => handleDelete(product?._id)}
        //                 variant="destructive"
        //                 className="flex-1 bg-red-500 hover:bg-red-600"
        //             >
        //                 <Trash2 className="size-4 mr-2" /> Delete
        //             </Button>
        //         </CardFooter>
        //     </div>
        // </Card>



        <Card
            className={`w-full max-w-xs mx-auto overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${isSale ? "border-orange-200 bg-orange-50/30" : "border-gray-200 bg-white"
                } hover:border-gray-300`}
        >
            <div className="group">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-3/4 bg-gray-100">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
                    />

                    {/* SALE Badge */}
                    {isSale && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            -{salePercent}%
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${inStock
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                        }`}>
                        {inStock ? "In Stock" : "Out of Stock"}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded size-7 bg-white/90 hover:bg-white shadow-sm border border-gray-300 hover:border-blue-400 hover:text-blue-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenCreateProductDialog(true);
                                setCurrentEditedId(product?._id);
                                setFormData(product);
                            }}
                        >
                            <Pencil className="size-3" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded size-7 bg-white/90 hover:bg-white shadow-sm border border-gray-300 hover:border-red-400 hover:text-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product?._id);
                            }}
                        >
                            <Trash2 className="size-3" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-3 space-y-2">
                    {/* Product Title */}
                    <h2 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-sm">
                        {product?.title}
                    </h2>

                    {/* Category & Brand */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="capitalize">{product?.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="capitalize">{product?.brand}</span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                            {isSale ? (
                                <>
                                    <span className="text-base font-bold text-gray-900">
                                        {formatCurrency(product?.salePrice)}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatCurrency(product?.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-base font-bold text-gray-900">
                                    {formatCurrency(product?.price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Count */}
                        <div className="text-xs text-gray-500 font-medium">
                            Stock: {product?.totalStock}
                        </div>
                    </div>

                    {/* Sale Info */}
                    {isSale && (
                        <div className="flex items-center justify-between bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            <span className="text-xs font-medium text-orange-700">
                                Save {formatCurrency(savedPrice)}
                            </span>
                            <span className="text-xs font-semibold text-orange-600">
                                {salePercent}% OFF
                            </span>
                        </div>
                    )}

                    {/* Additional info */}
                    <div className="pt-1 border-t border-gray-100">
                        {/* <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>SKU:</span>
                            <span className="font-mono text-gray-700">{product?.sku || "N/A"}</span>
                        </div> */}
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                            <span>Added:</span>
                            <span className="font-medium">
                                {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </CardContent>

                {/* Mobile Actions */}
                <CardFooter className="p-2 border-t bg-gray-50/50 md:hidden">
                    <div className="flex w-full gap-1">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenCreateProductDialog(true);
                                setCurrentEditedId(product?._id);
                                setFormData(product);
                            }}
                            variant="outline"
                            className="flex-1 text-xs h-7 border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
                        >
                            <Pencil className="size-3 mr-1" /> Edit
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product?._id);
                            }}
                            variant="outline"
                            className="flex-1 text-xs h-7 border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
                        >
                            <Trash2 className="size-3 mr-1" /> Delete
                        </Button>
                    </div>
                </CardFooter>
            </div>
        </Card>

    );
}

export default AdminProductTitle;

