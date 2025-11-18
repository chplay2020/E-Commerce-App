import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice/index";
import ShoppingProductTitle from "@/components/shopping-view/product-title";



function ShoppingListing() {
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);

    const dispatch = useDispatch()
    const { productList } = useSelector(state => state.shoppingProducts);

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
    }

    useEffect(() => {
        dispatch(fetchAllFilteredProducts());
    }, [dispatch])

    console.log("Product List:", productList);

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
                            10 Products
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
                                className="w-56 p-2 rounded-xl shadow-lg border bg-popover z-50"
                            >
                                <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium">
                                    SORT OPTIONS
                                </div>

                                <DropdownMenuRadioGroup>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            key={sortItem.id}
                                            value={sortItem.id}
                                            className="
                                                cursor-pointer px-3 py-2 text-sm rounded-md
                                                transition-all duration-200
                                                hover:bg-accent hover:text-accent-foreground"
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
                                <ShoppingProductTitle key={productItem.id} product={productItem} />
                            )) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ShoppingListing;