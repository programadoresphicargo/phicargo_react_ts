import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/modules/auth/hooks";

const RedireccionViajes = () => {
    const { session } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) {
            navigate("/", { replace: true });
            return;
        }

        if (session?.user.permissions.includes(500)) {
            navigate("/ViajesActivos", { replace: true });
        } else if (session?.user.permissions.includes(501)) {
            navigate("/ViajesFinalizados", { replace: true });
        } else if (session?.user.permissions.includes(502)) {
            navigate("/ViajesProgramados", { replace: true });
        } else if (session?.user.permissions.includes(503)) {
            navigate("/estadias", { replace: true });
        } else {
            alert('Sin permisos, notificar a sistemas.')
            navigate("/", { replace: true });
        }
    }, [session, navigate]);

    return null;
};

export default RedireccionViajes;
