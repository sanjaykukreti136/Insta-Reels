import { useContext } from "react";
import { auth } from "../firebase";

import { authContext } from "../AuthProvider";
import { Redirect } from "react-router-dom";
import "./Home.css"
import Videocard from "./Videocard"
let Home = () => {
  let user = useContext(authContext);
  return (
    <>
      {user ? "" : <Redirect to="/login" />}

      <div className="video-container" >
        <Videocard />
      </div>
      <button
        className="home-logout-btn"
        onClick={() => {
          auth.signOut();
        }}
      >
        lOGOUT
      </button>
    </>
  );
};

export default Home;
