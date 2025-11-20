import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice/index";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import { useSearchParams } from "react-router-dom";


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
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);

    const dispatch = useDispatch()
    const { productList } = useSelector(state => state.shoppingProducts);

    const [searchParams, setSearchParams] = useSearchParams();

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

    // Load initial filters from sessionStorage only once
    useEffect(() => {
        setSort('price-lowtohigh');
        const savedFilters = sessionStorage.getItem("filters");
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
    }, []); // Empty dependency array - run only once on mount


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

    console.log("filters", filters, searchParams.toString());

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
                                <ShoppingProductTitle key={productItem.id} product={productItem} />
                            )) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ShoppingListing;