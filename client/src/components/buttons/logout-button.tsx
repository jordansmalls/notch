import { useLogoutMutation } from "../../slices/users-api-slice";
import { logout as logoutAction } from "../../slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";



const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall, { isLoading }] = useLogoutMutation();


    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logoutAction())
            navigate("/login")
            toast.success("Logged out successfully.", { description: "We'll see you soon, right?" })
        } catch (err: any) {
            alert(err?.data?.message || "Logout failed.")
        };
    };


    return (
        <>
            <Button onClick={logoutHandler} disabled={isLoading} variant={"destructive"}>Logout</Button>
        </>

    )
}

export default LogoutButton