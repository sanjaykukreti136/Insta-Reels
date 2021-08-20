import { useContext, useEffect, useState } from "react";
import { auth, firestore, storage } from "../firebase";

import { authContext } from "../AuthProvider";
import { BrowserRouter, Redirect } from "react-router-dom";
import "./Home.css"
import Videocard from "./Videocard"
import { logDOM } from "@testing-library/react";
let Home = () => {
  let user = useContext(authContext);
  let [posts, setpost] = useState([])
  useEffect(() => {
    console.log("x");
    firestore.collection("posts").onSnapshot((querySnapshot) => {
      let docsArr = querySnapshot.docs;
      console.log("x");
      let arr = []
      for (let i = 0; i < docsArr.length; i++) {
        console.log(docsArr[i].data())
        arr.push({ id: docsArr[i].id, ...docsArr[i].data() })
      }
      setpost(arr);
    })
  }, [])

  return (
    <>
      {user ? "" : <Redirect to="/login" />}

      <div className="video-container" >
        {posts.map((el) => {
          return <Videocard key={el.id} data={el} />
        })}

      </div>
      <button
        className="home-logout-btn"
        onClick={() => {
          auth.signOut();
        }}
      >
        lOGOUT
      </button>
      <input
        onClick={(e) => {
          e.currentTarget.value = null;
        }}
        type="file" onChange={(e) => {
          let file = e.currentTarget.files[0];
          let { name, size, type } = file;

          size = size / 1000000;
          if (size > 10) {
            alert("size limit exceeds");
            return;
          }
          type = type.split("/")[0];
          if (type != "video") {
            alert("not video");
            return;
          }

          let uploadTask = storage.ref(`/posts/${user.uid}/${Date.now() + name}`).put(file)
          uploadTask.on("state_changed", null, null, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              console.log(url);
              firestore
                .collection("posts")
                .add({ name: user.displayName, url, like: [], comment: [] })
            }).then(() => {
              window.alert("New Posts");
              window.location.reload(false);
            }
            )
          })

        }} />
    </>
  );
};

export default Home;
