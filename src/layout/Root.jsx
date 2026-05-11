import Header from "../components/ui/Header/Header";
import { Outlet } from "react-router";
import Footer from "../components/ui/Footer/Footer";

function Root() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Root;
