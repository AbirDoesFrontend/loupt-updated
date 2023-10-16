// LouptAuthProvider.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import auth0config from '../auth0config.json';


interface LouptAuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => boolean;
  getUserJwt: () => string | undefined;
  getUserSub: () => string | undefined;
  showLogin: () => void;
}

const LouptAuthContext = createContext<LouptAuthContextProps | undefined>(undefined);

export const useLouptAuth = () => {
  const context = useContext(LouptAuthContext);
  if (!context) {
    throw new Error('useLouptAuth must be used within a LouptAuthProvider');
  }
  return context;
};

type LouptAuthProviderProps = {
  children: ReactNode;
};

export const LouptAuthProvider: React.FC<LouptAuthProviderProps> = ({ children }) => {
  const {
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
    logout: auth0Logout
  } = useAuth0();

  useEffect(() => {
    setIsLoading(auth0Loading)
  }, [auth0Loading]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const authenticate = async () => {
    const domain = auth0config.domain;
  
    //check if we have the auth0sub in local storage
    if (localStorage.getItem('jwt') && localStorage.getItem('auth0Sub')) {
      setIsAuthenticated(true);
      return true;
    }
  
    //if we can't find anything in localstorage, try to get it from auth0
    try {
      const accessToken = await getAccessTokenSilently({
        timeoutInSeconds: 5,
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
  
      localStorage.setItem('jwt', accessToken)
      //why are we URL encoding here?
      localStorage.setItem('auth0Sub', user?.sub ?? '');
  
      setIsAuthenticated(true);
      return true
  
    } catch (e) {
      console.log("error in getUserToken: ")
      if (e instanceof Error) {
        console.log(e.message);
      }
      setIsAuthenticated(false);
      return false;
    }
  };

  const getUserSub = () => {
    const sub = localStorage.getItem('auth0Sub');
    if(!sub) return undefined;
    return sub
  };

  const getUserJwt = () => {
    const jwt = localStorage.getItem('jwt');
    if(!jwt) return undefined;
    return jwt
  }

  const showLogin = () => {
    loginWithRedirect();
  }

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('auth0Sub');
    setIsAuthenticated(false);
    auth0Logout(
        {logoutParams: {
          returnTo: window.location.origin,
        }}
    );
    return true;
  }

  return (
    <LouptAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        authenticate,
        logout,
        getUserJwt,
        getUserSub,
        showLogin
      }}
    >
      {children}
    </LouptAuthContext.Provider>
  );
};
