// import { Card, CardContent, CardFooter } from "@/components/ui/card.jsx";
// import { Button } from "@/components/ui/button.jsx";

// function AdminProductTitle({ product }) {
//     return (
//         <Card className="w-full max-w-sm mx-auto">
//             <div>
//                 <div className="relative">
//                     <img
//                         src={product?.image}
//                         alt={product?.title}
//                         className="w-full h-[250px] object-cover rounded-t-lg"
//                     />
//                 </div>
//                 <CardContent>
//                     <h2 className="text-xl font-bold mb-2 mt-2">
//                         {product?.title}
//                     </h2>
//                     <div className="flex justify-between items-center mb-2">
//                         <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>
//                             ${product?.price}
//                         </span>
//                         {
//                             product?.salePrice > 0 ? (
//                                 <span className="text-lg font-bold">
//                                     ${product?.salePrice}
//                                 </span>
//                             ) : null
//                         }

//                     </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between items-center">
//                     <Button>
//                         Edit
//                     </Button>
//                     <Button>
//                         Delete
//                     </Button>
//                 </CardFooter>
//             </div>
//         </Card>
//     )
// }

// export default AdminProductTitle;

import { Card, CardContent, CardFooter } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

function AdminProductTitle({
    product,
    setFormData,
    setOpenCreateProductDialog,
    setCurrentEditedId,
    handleDelete
}) {
    const isSale = product?.salePrice > 0;
    const savedPrice = product?.price - product?.salePrice;

    return (
        <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border">
            <div className="group">

                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-full object-cover "
                    />

                    {/* SALE badge */}
                    {isSale && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                            SALE
                        </div>
                    )}

                    {/* Gradient overlay (đẹp, không làm đen ảnh) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-3">
                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight min-h-[3rem]">
                        {product?.title}
                    </h2>

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Giá gốc */}
                            <span
                                className={
                                    isSale
                                        ? "line-through text-gray-500 text-sm"
                                        : "text-xl font-bold text-primary"
                                }
                            >
                                ${product?.price}
                            </span>

                            {/* Giá sale */}
                            {isSale && (
                                <span className="text-xl font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                    ${product?.salePrice}
                                </span>
                            )}
                        </div>

                        {/* Save */}
                        {isSale && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                Save ${savedPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                </CardContent>

                {/* Actions */}
                <CardFooter className="p-5 pt-0 flex justify-between gap-3">
                    <Button
                        onClick={() => {
                            setOpenCreateProductDialog(true);
                            setCurrentEditedId(product?._id);
                            setFormData(product);
                        }}
                        variant="outline"
                        className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(product?._id)}
                        variant="destructive"
                        className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </Button>
                </CardFooter>

            </div>
        </Card>
    );
}

export default AdminProductTitle;

