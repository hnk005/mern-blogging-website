import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import { useAuth } from "@/context/AuthContext";
import paths from "@/routes/paths";
import { Link } from "react-router-dom";

const UserNavigatePanel = () => {
  const { user, signOut } = useAuth();
  const username = user ? user.username : "";
  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        <Link to={`${paths.user}/${username}`} className="link pl-8 py-4">
          Profile
        </Link>
        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to="/setting/edit-profile" className="link pl-8 py-4">
          Setting
        </Link>
        <span className="absolute border-t border-grey w-full"></span>
        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signOut}
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p>@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigatePanel;
