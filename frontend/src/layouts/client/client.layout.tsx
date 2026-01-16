import { Outlet } from "react-router"
import ClientHeader from "./header"
import ClientFooter from "./footer"

const ClientLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <ClientHeader />
            <div className="flex-grow">
                <Outlet />
            </div>
            <ClientFooter />
        </div>
    )
}

export default ClientLayout