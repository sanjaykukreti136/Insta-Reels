import { createContext, useEffect, useState } from "react";
import { auth, firestore } from "./firebase";


export const authContext = createContext();

let AuthProvider = (props) => {

  console.log(props);

  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);

  useEffect(() => {


    let unsub = auth.onAuthStateChanged((user) => {

      if (user) {
        let { displayName, email, uid, photoURL } = user;
        let docRef = firestore.collection("user").doc(uid)

        let documentSnapshot = docRef.get()

        if (!documentSnapshot.exists) {

          docRef.set({
            displayName,
            email,
            photoURL
          })

        }

        // let docRef = firestore.collection("user").doc(uid);
        // let docsnapshot = await docRef.get();

        // if (!docsnapshot.exists) {
        //   docRef.set({
        //     displayName,
        //     email,
        //     photoURL
        //   })
        // }

        setUser({ displayName, email, uid, photoURL });
      } else {
        setUser(null);
      }

      setLoading(false);


    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <authContext.Provider value={user}>

      {!loading && props.children}

    </authContext.Provider>
  );
};

export default AuthProvider;
