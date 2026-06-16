import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const Layout = () => {
  return (
    <div>
      {/* this class purpose of use because need sidebar in fixed position and other div will take a full width. */}
      <SideBar />

      <div style={{ marginLeft: "15rem", minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;