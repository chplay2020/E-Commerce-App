import { useState } from "react";
import { Label } from "../ui/label";
import { DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";



const initialFormData = {
    status: "",
}


function AdminOrderDetailsView() {

    const [formData, setFormData] = useState(initialFormData);

    function handleUpdateStatus(event) {
        event.preventDefault();
    }

    return (
        <div className="grid gap-6">
            <DialogTitle>Order Details</DialogTitle>
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <p className="font-medium">
                        Order ID:
                    </p>
                    <Label className="text-sm">
                        #ORD123456
                    </Label>
                </div>

                <div className="flex items-center justify-between">
                    <p className="font-medium">
                        Order Date:
                    </p>
                    <Label className="text-sm">
                        27/06/2024
                    </Label>
                </div>

                <div className="flex items-center justify-between">
                    <p className="font-medium">
                        Order Price:
                    </p>
                    <Label className="text-sm">
                        $1000
                    </Label>
                </div>

                <div className="flex items-center justify-between">
                    <p className="font-medium">
                        Order Status:
                    </p>
                    <Label className="text-sm">
                        In Process
                    </Label>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">
                        Order Details
                    </div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span>Product 1</span>
                            <span>$100</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">
                        Shipping Info
                    </div>
                    <div className="grid gap-0.5 text-muted-foreground">
                        <span>John Doe</span>
                        <span>Address</span>
                        <span>City</span>
                        <span>Pincode</span>
                        <span>Phone</span>
                        <span>Notes</span>
                    </div>
                </div>
            </div>

            <div>
                <CommonForm
                    className="cursor-pointer"
                    formControls={[
                        {
                            label: "Order Status",
                            name: "status",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "Pending" },
                                { id: "inProcess", label: "In Process" },
                                { id: "inShipping", label: "In Shipping" },
                                { id: "delivered", label: "Delivered" },
                                { id: "rejected", label: "Rejected" }
                            ]
                        }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={"Update Order Status"}
                    onSubmit={handleUpdateStatus}
                />
            </div>
        </div>
    )
}

export default AdminOrderDetailsView;