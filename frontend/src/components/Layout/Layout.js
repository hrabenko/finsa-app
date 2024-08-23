import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
function Layout () {
    return (
        <div className='layout'>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout;