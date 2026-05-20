import {Outlet} from "react-router-dom"
import SideBar from "../components/SideBar";

const Layout=()=>{
    return(
        <div className="d-flex">
            {/* this class purpose of use because need sidebar in fixed position and other div will take a full width. */}
            <SideBar/>
            <div className="flex-grow-1">
            <Outlet/>
            </div>
        </div>
    )
}

export default Layout;