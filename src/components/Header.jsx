import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ApiUrlContext, UserContext } from "./../Context";

export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()

    const [user] = useContext(UserContext)
    const apiUrl = useContext(ApiUrlContext)


    // useEffect(() => {
    //     return <Hero />
    //     if (user !== "afaohfaoh") {
    //         console.log("Hero")
    //         return <Hero />
    //     }
    // }, [navigate, user])

    return (<>
        <div className="w-full h-20 text-xl text-gray-300 flex flex-row justify-center md:justify-end items-center gap-5 md:pr-10">
            <Link className={location.pathname === "/" ? "text-white" : ""} to="/">Timer</Link>
            <Link className={location.pathname === "/settings" ? "text-white" : ""} to="/settings">Settings</Link>
            <Link className={location.pathname === "/reports" ? "text-white" : ""} to="/reports">Reports</Link>
            {/* <Link to="/profile" style={{ "display": "flex", "alignItems": "center" }}>
                <img className="profile-pic" src={profileUrl} alt="profile pic" />
                <p>Profile</p>
            </Link> */}
        </div>
        <Outlet /> { /** This is where the body of your application will be rendered. **/}
    </>);
}