import logo from "../../assets/TT Logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-light shadow-sm p-3 mb-5 bg-white">
      <div className="container-fluid">
        <img
          src={logo}
          alt="logo"
          width="200"
          height="24"
          className="d-inline-block align-text-top"
        />
        {accessToken && (
          <form className="d-flex" role="search">
            <button
              className="btn text-light"
              type="submit"
              style={{ backgroundColor: "#4F46F8" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
