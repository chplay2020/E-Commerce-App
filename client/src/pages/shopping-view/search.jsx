import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getSearchDetails } from "@/store/shop/search-slice"
import ShoppingProductTitle from "@/components/shopping-view/product-title"
import { resetSearchResults } from "@/store/shop/search-slice"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import ProductDetailsDialog from "@/components/shopping-view/product-details"
import { toast } from "sonner"
import { fetchProductDetails } from "@/store/shop/products-slice/index"



function SearchProducts() {

    const [keyword, setKeyword] = useState("")
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()

    const { searchResults, isLoading } = useSelector(state => state.shopSearch)
    const { cartItems } = useSelector(state => state.shopCart)
    const { user } = useSelector(state => state.auth)
    const { productDetails } = useSelector(state => state.shoppingProducts)

    useEffect(() => {
        if (keyword && keyword.trim() !== "" && keyword.trim().length >= 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchDetails(keyword))
            }, 1000)
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())
        }
    }, [keyword])


    function handleAddtoCart(getCurrentProductId, getTotalStock, quantity = 1) {
        console.log("Adding to cart:", cartItems);
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex((item => item.productId._id === getCurrentProductId));
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem]?.quantity || 0;

                if (getQuantity + 1 > getTotalStock) {
                    toast.error(
                        `Only ${getTotalStock} items in stock. You already have ${getQuantity} in your cart.`
                    );
                    return;
                }
            }
        }

        dispatch(addToCart(
            {
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: quantity
            }
        )).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id))
                toast.success("Item added to cart");
            }
        });
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    useEffect(() => {
        if (productDetails !== null && Object.keys(productDetails).length > 0) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails])

    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input
                        value={keyword}
                        name="keyword"
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            {
                !searchResults.length && keyword.trim().length >= 3 && !isLoading ? (
                    <p className="text-center text-gray-500 font-bold">No products found for "{keyword}"</p>
                ) : null
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    searchResults.map((item) => (
                        <ShoppingProductTitle
                            key={item._id}
                            product={item}
                            handleAddtoCart={handleAddtoCart}
                            handleGetProductDetails={handleGetProductDetails}
                        />
                    ))
                }
            </div>
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
                handleAddtoCart={handleAddtoCart}
            />
        </div>
    )
}

export default SearchProducts