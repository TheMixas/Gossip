import '../scss/navbar.scss';
import SearchInputField from "./_Shared/SearchInputField";
import Button from "./button";
import NavBarProfile from "./_Shared/NavBarProfile";
import {Link} from "react-router-dom";
import {getUsername} from "../utils/Utils";
import {isAuthenticated} from "../utils/AuthCalls";
function Navbar(){
  return (
      <div className="header">
    <div className="navbar">
        <div className="navbar navbar__left-box">
            <div className="navbar__links">
                <Link id="home" href="/" to="/">Home</Link>
                <Link to={`/notifications`}>Notifications</Link>
                <Link to="/messages">Messages</Link>
                <Link to={isAuthenticated() ? `/${getUsername()}` : '/users/no-user'}>Me</Link>

            </div>

        </div>
        <div className="navbar navbar__center-box">
            <a className="home-logo" href="/"></a>

        </div>
        <div className="navbar navbar__right-box">

            <SearchInputField placeholder={"Search Gossip"} type={"nav-bar"}/>
            <NavBarProfile/>
            {/*<Button text={"Tweet"} type="create-post"/>*/}

        </div>
    </div>
          <div className="navbar__line"></div>
      </div>
  );
}
export default Navbar;