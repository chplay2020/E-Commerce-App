import { Link } from "react-router-dom";
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "../../config/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/auth-slice/index.js";
import { toast } from "sonner";

const initialState = {
    userName: '',
    email: '',
    password: ''
}


function AuthRegister() {

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch() // đường dẫn gửi action
    const navigate = useNavigate() // đường dẫn chuyển hướng


    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => { // Gọi action đăng ký từ file auth-controller.js
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                setTimeout(() => navigate('/auth/login'), 1000)
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }


    console.log(formData);

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground ">Create new account</h1>
                <p className="mt-2">
                    Already have an account?&nbsp;
                    <Link className="font-medium text-primary hover:underline" to="/auth/login">
                        Login
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={'Sign Up'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    )
}


export default AuthRegister;