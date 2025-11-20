import { Fragment } from "react";
import { filterOptions } from "@/config/index";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";


function ProductFilter({ filters, handleFilter }) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map((keyItem) => (
                        <Fragment key={keyItem}>
                            <div>
                                <h3 className="text-base font-bold mb-2 capitalize">{keyItem}</h3>
                                <div className="grid gap-2 mt-2">
                                    {
                                        filterOptions[keyItem].map((option) => (
                                            <div key={option.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                                <Checkbox
                                                    checked={
                                                        filters &&
                                                        Object.keys(filters).length > 0 && filters[keyItem] &&
                                                        filters[keyItem].indexOf(option.id) > -1
                                                    }
                                                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                                                />
                                                <span className="text-sm text-gray-700 select-none">
                                                    {option.label}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <Separator />
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductFilter;