'use client'

import {
  useContext,
  createContext,
  useState,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { redirect } from "next/navigation";

interface AuthContextProps {
  googleSignIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const { email, uid, displayName } = user;
        console.log(token, user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('isLoggedIn', true.toString());

        fetch(`/api/auth?email=${email}&guid=${uid}`)
          .then((response) => response.json())
          .then(result => {
            console.log(result);
            if (result.ok) {
              setTimeout(() => {
                redirect('/home')
              }, 1000);
            }
            else {
              fetch(`/api/auth`, {
                method: 'POST',
                body: JSON.stringify({ name: name, email: email, guid: uid }),
                headers: {
                  'content-type': 'application/json'
                }
              })
                .then(response => response.json())
                .then((result) => {
                  if (result.ok) {
                    console.log(result, 'sucessfully stored the user');
                  }
                  else {
                    console.log('could not save the user');
                  }
                })
                .catch(err => console.log(err));
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }).catch((error) => {
        console.log(error)
        const { errorCode, errorMessage } = error;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, credential);
      });
  };

  const logOut = () => {
    console.log('logging out')
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    signOut(auth);
  };


  return (
    <AuthContext.Provider value={{ googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
export { useAuth, AuthContextProvider }



/*
 const googleSignIn = async () => {
    console.log('singing in..')
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log(token, user);
      const email = user.email;
      const guid = user.uid;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('isLoggedIn', true.toString());

      const response = await fetch(`/api/auth?email=${email}&guid=${guid}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        redirect('/home')
      } else {
        const response = await fetch(`/api/auth`, {
          method: 'POST',
          body: JSON.stringify({ name: user.displayName, guid: user.uid, email: user.email }),
          headers: {
            'content-type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error('could not save the user');
        }
        const data = await response.json();
        console.log(data);
        redirect('/home')
      }
    } catch (error) {
      console.log(error);
    }
  };

  */
// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//     setUser(currentUser);
//   });
//   return unsubscribe;
// }, []);