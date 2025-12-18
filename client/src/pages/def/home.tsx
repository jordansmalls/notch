import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { ModeToggle } from "../../components/theme/mode-toggle";

const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <div>
                <Link to={"/login"}><Button>Login</Button></Link>
                <Link to={"/signup"}><Button>Signup</Button></Link>
            </div>
            <div>
                <ModeToggle />
            </div>
        </>
     );
}

export default Home;