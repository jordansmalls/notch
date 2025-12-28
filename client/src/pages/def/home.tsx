import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/ui/spinner";

// TODO: update URL for redirction to landing page

const Home = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            window.location.href = "https://letterboxd.com/film/interstellar/";
        } else {
            const timer = setTimeout(() => {
                navigate("/dashboard");
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-3xl justify-center">
                <Spinner className="size-10" />
                <h1>Loading</h1>
            </div>
        </div>
    );
}

export default Home;