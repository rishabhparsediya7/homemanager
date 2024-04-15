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
import { redirect } from "next/navigation";
import Loader from "@/components/Loader";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

interface AuthContextProps {
  googleSignIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);
  const googleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    let credential, token: string, user: any;
    signInWithPopup(auth, provider)
      .then((result) => {
        credential = GoogleAuthProvider.credentialFromResult(result);
        token = String(credential?.accessToken);
        user = result.user;
        const { email, uid } = user;
        fetch(`/api/auth?email=${email}&guid=${uid}`)
          .then((response) => {
            return response.json();
          })
          .then(result => {
            if (result.ok) {
              redirect('/home')
            }
            else {
              fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({ name: user.displayName, email: email, uid: uid }),
                headers: {
                  'content-type': 'application/json'
                }
              })
                .then((response) => response.json())
                .then((result) => {
                  if (!result.ok) {
                    throw new Error('Could not save the user!');
                  }
                  else {
                    router.push('/home')
                  }
                })
                .catch(err => console.log(err))
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('isLoggedIn', true.toString());
      });
  };
  if (loading)
    return <Loader />

  const logOut = () => {
    console.log('logging out')
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    signOut(auth);
    window.location.reload()
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