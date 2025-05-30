import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useState } from "react";
import clsx from "clsx";
import paths from "@/routes/paths";
import { useAuth } from "@/context/AuthContext";
import UserNavigatePanel from "@/components/user/UserNavigatePanel";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const {
    user: { profile_img },
    isAuth,
  } = useAuth();
  const [showUserNavPanel, setShowUserNavPanel] = useState(false);
  const navigate = useNavigate();

  const toggleUserNavPanel = () => {
    setShowUserNavPanel((currentValue) => !currentValue);
  };

  const toggleSearchBox = () => {
    setSearchBoxVisibility((currentValue) => !currentValue);
  };

  const handleBlurUserNavPanel = () => {
    setTimeout(() => setShowUserNavPanel(false), 200);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const query = target.value;
    if (e.keyCode == 13 && query.length) {
      navigate(`${paths.search}/${query}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="flex-none w-10">
        <img src={logo} className="w-full" />
      </Link>

      <div
        className={clsx(
          "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show",
          searchBoxVisibility ? "show" : "hide"
        )}
      >
        <input
          onKeyDown={handleSearch}
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-grey w-12 h-12 rounded-full items-center justify-center"
          onClick={toggleSearchBox}
        >
          <i className="fi fi-rr-search text-xl"></i>
        </button>
        <Link to={paths.editor} className="hidden md:flex gap-2 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        {isAuth() ? (
          <>
            <Link to="/dashboard/notification">
              <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                <i className="fi fi-rr-bell text-2xl block mt-1"></i>
              </button>
            </Link>
            <div className="relative" onBlur={handleBlurUserNavPanel}>
              <button className="w-12 h-12 mt-1" onClick={toggleUserNavPanel}>
                <img
                  src={profile_img}
                  alt="profile image"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {showUserNavPanel && <UserNavigatePanel />}
            </div>
          </>
        ) : (
          <>
            <Link to={paths.signIn} className="btn-dark py-2">
              Sign In
            </Link>
            <Link to={paths.signUp} className="btn-light py-2 hidden md:block">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
