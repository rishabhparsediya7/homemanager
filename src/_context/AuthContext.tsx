'use client'

import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  Auth,
  User,
} from "firebase/auth";
import { auth } from "@/firebase";
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
        console.log(token, user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('isLoggedIn', true.toString());

        fetch('/api/auth')
          .then((response) => {
            const result = response.json();
            return result;
          })
          .then(result => {
            console.log(result);
            if (result.ok) {
              setTimeout(() => {
                redirect('/home')
              }, 1000);
            }
            else{
              
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }).catch((error) => {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

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