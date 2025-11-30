import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails, resetProductDetails } from "@/store/shop/products-slice/index";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useSearchParams } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";



function createSearchParamsHelper(filtersParams) {
    const queryParams = []

    for (const [key, value] of Object.entries(filtersParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join('&');
}


function ShoppingListing() {
    const dispatch = useDispatch()
    const { productList, productDetails } = useSelector(
        (state) => state.shoppingProducts
    );
    const { user } = useSelector(
        (state) => state.auth
    );
    const { cartItems } = useSelector((state) => state.shopCart);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const categorySearchParam = searchParams.get('category');

    function handleSort(value) {
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption]
            }
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption);
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }

        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

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

    // Load initial filters from sessionStorage only once
    useEffect(() => {
        setSort('price-lowtohigh');
        const savedFilters = sessionStorage.getItem("filters");
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters) || {});
        }
    }, [categorySearchParam]); // Empty dependency array - run only once on mount


    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters]); // Run when filters change


    useEffect(() => {
        if (filters !== null && sort !== null) {
            dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
        }
    }, [dispatch, sort, filters]);

    useEffect(() => {
        if (productDetails !== null && Object.keys(productDetails).length > 0) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails])

    // Reset productDetails when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetProductDetails());
        };
    }, [dispatch]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">
                        All Products
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                            {productList?.length} Products
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 rounded-md border-input text-sm"
                                >
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-lg shadow-lg border bg-popover z-50"
                            >
                                <div className="px-3 py-1.5 text-xs text-muted-foreground font-semibold uppercase">
                                    Sort Options
                                </div>

                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            key={sortItem.id}
                                            value={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                    {
                        productList && productList.length > 0 ?
                            productList.map((productItem) => (
                                <ShoppingProductTitle
                                    key={productItem.id} product={productItem}
                                    handleGetProductDetails={handleGetProductDetails}
                                    handleAddtoCart={handleAddtoCart}
                                />
                            )) : null
                    }
                </div>
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

export default ShoppingListing;