import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import { useState } from "react"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

function AdminProducts() {

    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductDialog(true)}>
                    Add New Product
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                <Sheet
                    open={openCreateProductDialog} onOpenChange={() => {
                        setOpenCreateProductDialog(false)
                    }}
                >
                    <SheetContent side="right" className="overflow-auto">
                        <SheetHeader>
                            <SheetTitle>
                                Add New Product
                            </SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </Fragment>
    )
}

export default AdminProducts