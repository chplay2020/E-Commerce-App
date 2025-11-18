import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import CommonForm from "@/components/common/form"
import { addProductFormElements } from "@/config"
import ProductImageUpload from "@/components/admin-view/image-upload"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { editProduct, fetchAllProducts, deleteProduct } from "@/store/admin/products-slice/index.js"
import { addNewProduct } from "@/store/admin/products-slice/index.js"
import { toast } from "sonner"
import AdminProductTitle from "@/components/admin-view/product-title"


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
    const [imageFile, setImageFile] = useState(null); // State để quản lý file hình ảnh
    const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // State để quản lý URL hình ảnh đã tải lên
    const [imageLoadingState, setImageLoadingState] = useState(false); // State để quản lý trạng thái tải hình ảnh
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();


    function onSubmit(event) {
        // Xử lý submit form edit sản phẩm
        event.preventDefault();

        currentEditedId !== null ?
            // Xử lý submit form edit sản phẩm
            dispatch(editProduct({
                id: currentEditedId,
                formData
            })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductDialog(false);
                    setCurrentEditedId(null);
                    toast.success(data?.payload?.message)
                }
            }) :
            // Xử lý submit form thêm sản phẩm
            dispatch(addNewProduct({
                ...formData,
                image: uploadedImageUrl
            })
            ).then((data) => {
                if (data?.payload?.success) {
                    // Reset form và trạng thái hình ảnh sau khi thêm sản phẩm thành công
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setImageFile(null);
                    setUploadedImageUrl('');
                    setImageLoadingState(false);
                    setOpenCreateProductDialog(false);
                    toast.success(data?.payload?.message)
                }
            })
        // Đóng dialog sau khi thêm sản phẩm
        setOpenCreateProductDialog(false);

    }

    // function isFormValid() {
    //     return Object.keys(formData).map((key) => {
    //         formData[key] !== ''
    //     }).every(item => item);
    // }

    function handleDelete(productId) {
        if (!productId) return;
        dispatch(deleteProduct({ id: productId }))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    toast.success(data?.payload?.message);
                } else {
                    toast.error(data?.payload?.message || 'Failed to delete product');
                }
            });
    }

    function isFormValid() {
        const requiredFields = [
            'title',
            'description',
            'category',
            'brand',
            'price',
            'totalStock'
        ];

        const hasRequired = requiredFields.every((key) => {
            const v = formData[key];
            return v !== undefined && v !== null && String(v).trim() !== '';
        });

        const priceOk = !Number.isNaN(Number(formData.price)) && Number(formData.price) > 0;
        const stockOk = !Number.isNaN(Number(formData.totalStock)) && Number(formData.totalStock) >= 0;
        const saleOk = formData.salePrice === '' || formData.salePrice === null || (!Number.isNaN(Number(formData.salePrice)) && Number(formData.salePrice) >= 0);

        // In edit mode, we allow existing image; in add mode, require uploaded image URL
        if (currentEditedId !== null) {
            return hasRequired && priceOk && stockOk && saleOk;
        }

        const imageOk = Boolean(uploadedImageUrl) && !imageLoadingState;
        return hasRequired && priceOk && stockOk && saleOk && imageOk;
    }


    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch])

    console.log(formData, "productList");
    console.log(formData.category)


    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductDialog(true)}>
                    Add New Product
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {
                    productList && productList.length > 0
                        ?
                        productList.map((productItem) =>
                            <AdminProductTitle
                                setFormData={setFormData}
                                setOpenCreateProductDialog={setOpenCreateProductDialog}
                                setCurrentEditedId={setCurrentEditedId}
                                key={productItem._id}
                                product={productItem}
                                handleDelete={handleDelete}
                            />
                        )
                        : null
                }
            </div>
            <Sheet
                open={openCreateProductDialog}
                onOpenChange={() => {
                    setOpenCreateProductDialog(false)
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }}
            >
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold mb-4">
                            {
                                currentEditedId !== null ? 'Edit Product' : 'Add New Product'
                            }
                        </SheetTitle>
                        <ProductImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            uploadedImageUrl={uploadedImageUrl}
                            setUploadedImageUrl={setUploadedImageUrl}
                            setImageLoadingState={setImageLoadingState}
                            imageLoadingState={imageLoadingState}
                            isEditedMode={currentEditedId !== null}

                        />
                        <div className="py-6">
                            {/* Form thêm sản phẩm sẽ nằm ở đây */}
                            <CommonForm
                                onSubmit={onSubmit}
                                formData={formData}
                                setFormData={setFormData}
                                buttonText={currentEditedId !== null ? 'Edit Product' : 'Add Product'}
                                formControls={addProductFormElements}
                                isBtnDisabled={!isFormValid()}
                            />
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </Fragment>
    )
}

export default AdminProducts