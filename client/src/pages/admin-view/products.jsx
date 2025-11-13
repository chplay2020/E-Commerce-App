import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import { useState } from "react"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import CommonForm from "@/components/common/form"
import { addProductFormElements } from "@/config"

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: ''
};

function AdminProducts() {

    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);

    const [formData, setFormData] = useState(initialFormData); // State để quản lý dữ liệu form



    function onSubmit() {
        // Xử lý submit form thêm sản phẩm
    }


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
                            <div className="py-6">
                                {/* Form thêm sản phẩm sẽ nằm ở đây */}
                                <CommonForm
                                    onSubmit={onSubmit}
                                    formData={formData}
                                    setFormData={setFormData}
                                    buttonText='Add Product'
                                    formControls={addProductFormElements}
                                />
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </Fragment>
    )
}

export default AdminProducts