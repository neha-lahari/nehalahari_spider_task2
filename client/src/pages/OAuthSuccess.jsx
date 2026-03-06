import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OAuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard/groups");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return <div>Logging you in...</div>;
}

export default OAuthSuccess;
