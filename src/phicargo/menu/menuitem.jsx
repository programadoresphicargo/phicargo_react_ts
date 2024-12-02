import React from "react";
import { useNavigate } from "react-router-dom"; // Para manejar navegación
const { VITE_PHIDES_API_URL } = import.meta.env;

const MenuItem = ({ icon, label, link }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <div
            onClick={handleClick}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                margin: "10px",
                borderRadius: "20px",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                <img
                    src={VITE_PHIDES_API_URL + `/img/menu/${icon}`}
                    alt={label}
                    style={{ width: "100px", height: "100px", marginBottom: "5px" }}
                />
            </div>
            <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                {label}
            </div>
        </div>
    );
};

export default MenuItem;
