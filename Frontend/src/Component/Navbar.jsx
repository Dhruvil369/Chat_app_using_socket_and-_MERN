import { Link,useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User  } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate=useNavigate();

  const handleLogout = async () => {
    await logout();  // Call logout function
    navigate("/login");  // Navigate to signup page after logout
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            

            {!authUser && (
              <>
                <Link to={"/signup"}>
                <button className="flex gap-2 items-center ml-2 mr-2 hover:bg-black pl-3 pt-2 pb-2 pr-3 border-solid rounded-full">
                  <span className="hidden sm:inline">Sign-in </span>
                </button>
                </Link>
                
                <Link to={"/login"}>
                <button className="flex gap-2 items-center ml-2  hover:bg-black pl-3 pt-2 pb-2 pr-3 border-solid rounded-full">
                  <span className="hidden sm:inline pd-4">Log-in </span>
                </button>
                </Link>
              </>
            )}

            {authUser && (
              <>
                  <Link
                  to={"/settings"}
                  className={`
                  btn btn-sm gap-2 transition-colors
                  
                  `}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;