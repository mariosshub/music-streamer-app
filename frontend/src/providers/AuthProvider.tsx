import useCustomizedToast from "@/hooks/useCustomizedToast";
import { axiosInstance } from "@/lib/axios";
import { disconnectSocket, initSocket } from "@/lib/socket";
import { AuthResponse } from "@/models/AuthResponse";
import { UserModel } from "@/models/User";
import { resetAllStores } from "@/stores/storeCreator";
import { useMusicStore } from "@/stores/useMusicStore";
import { useSongCommentsStore } from "@/stores/useSongCommentsStore";
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router";

type AuthContextType = {
  token: string | null;
  refreshToken: string | null;
  isLoggedIn:  boolean;
  loggedInUser: UserModel | null;
  signUp: (email: string, username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  refreshUsersToken: () => Promise<string | undefined>;
};

type Props = { children: React.ReactNode };

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null);
  const {toastErrorApi} = useCustomizedToast();
  const {setReceivedComments} = useSongCommentsStore();
  const {setRecentlyReleasedSongs} = useMusicStore();

  useEffect(() => {
    console.log('Auth provider got token', token);
    if (token && token.length !== 0 ) {
      localStorage.setItem("token", token)
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
      setIsLoggedIn(true);
      // connect the socket
      initSocket(token, setReceivedComments, setRecentlyReleasedSongs)
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
      setIsLoggedIn(false);
      disconnectSocket();
    }
  }, [token])

  useEffect(() => {
    if(refreshToken)
      localStorage.setItem("refreshToken", refreshToken);
    else
      localStorage.removeItem("refreshToken");
  },[refreshToken])

  useEffect(() => {
    if(loggedInUser)
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    else
      localStorage.removeItem("user");
  },[loggedInUser])

  const signUp = async (email: string, username: string, password: string) => {
    try{
        const response = await axiosInstance.post<AuthResponse>('/auth/signup', {
          email,
          username,
          password
        });

        if(response){
          setToken(response.data.accessToken)
          setRefreshToken(response.data.refreshToken);
          setLoggedInUser({
            _id: response.data.id,
            email: response.data.email,
            username: response.data.username
          })
          navigate("/home")
        }
    } catch(error:any) {
      toastErrorApi(error);
    }
  }

  const login = async (username: string, password: string) => {
    try{
      const response = await axiosInstance.post<AuthResponse>('/auth/login', {
        username,
        password
      });

      if(response) {
          setToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
          setLoggedInUser({
            _id: response.data.id,
            email: response.data.email,
            username: response.data.username
          })
          navigate("/home");
      }
    } catch(error: any) {
      toastErrorApi(error);
    }
  }

  const logout = async() => {
    try{
      await axiosInstance.get('/auth/logout')
      setToken(null);
      setRefreshToken(null);
      setLoggedInUser(null);
      resetAllStores(); // clear all stores
      navigate("/logout", {replace: true})
    } catch(error: any){
       toastErrorApi(error);
    } finally {
      setToken(null);
      setRefreshToken(null)
      setLoggedInUser(null);
    }
  }

  const refreshUsersToken = async() => {
    try{
      // set the refreshToken at the authorization header
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + refreshToken;
      const response = await axiosInstance.get<AuthResponse>('auth/refreshToken');

      if(response){
        console.log('refreshed token successfully')
        setToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        return response.data.accessToken;
      }
    } catch(error: any) {
      // refresh token expired loggout the user
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('refresh token expired logging out user..')
        setToken(null);
        setLoggedInUser(null);
        navigate('/logout', {replace: true})
      }
    }
  }


  return (
    <AuthContext.Provider value={{token, refreshToken, isLoggedIn, loggedInUser, signUp, login, logout, refreshUsersToken}}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);