import { useState } from 'react';
import { useEffect } from 'react';
import { createContext, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
  name: string;
  avatar: string;
  id: string;
}

type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  createUser: (user: User) => void;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account')
        }

        createUser({
          name: displayName,
          avatar: photoURL,
          id: uid,
        })
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google account')
      }

      setUser({
        name: displayName,
        avatar: photoURL,
        id: uid
      })

    }
  }

  function createUser(user: User) {
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      createUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
