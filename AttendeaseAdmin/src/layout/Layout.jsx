import { Outlet, useNavigation } from "react-router-dom";
import SideBar from "../components/SideBar";
import LoadingSpinner from "../components/LoadingSpinner";

const Layout = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div>
      {isNavigating && <LoadingSpinner message="Loading page..." />}
      <SideBar />

      <div style={{ marginLeft: "15rem", minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;