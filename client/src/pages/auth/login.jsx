import { Link } from "react-router-dom";
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "../../config/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginFormControls } from "../../config/index.js";
import { loginUser } from "../../store/auth-slice/index.js";

const initialState = {
    email: '',
    password: ''
}


function AuthLogin() {

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch() // đường dẫn gửi action

    function onSubmit(event) {
        event.preventDefault();


        dispatch(loginUser(formData)).then((data) => { // Gọi action đăng nhập từ file auth-controller.js
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                setTimeout(() => navigate('/'), 1000)
            } else {
                toast.error(data?.payload?.message)
            }
        })

    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground ">Login to your account</h1>
                <p className="mt-2">
                    Don't have an account?&nbsp;
                    <Link className="font-medium text-primary hover:underline" to="/auth/register">
                        Register
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={loginFormControls}
                buttonText={'Sign In'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    )
}


export default AuthLogin;