import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { ToastContainer } from 'react-toastify'
import { useAuthInterceptor } from './hooks/useAuthInterceptor'
import MainLayout from './layout/MainLayout'
import WelcomePage from './pages/WelcomePage'
import AlbumsPage from './pages/AlbumsPage'
import LoadingPage from './pages/LoadingPage'
import LoggingOutPage from './pages/LoggingOutPage'
import { useAuth } from './providers/AuthProvider'
import SongsPage from './pages/SongsPage'
import CommentsPage from './pages/CommentsPage'
import ErrorPage from './pages/ErrorPage'
import DiscoverPage from './pages/DiscoverPage'
import SongsByGenrePage from './pages/SongsByGenrePage'
function App() {
  // calling the authInterceptor hook for handling refresh token authorization
  const {interceptorReady} = useAuthInterceptor();
  const {isLoggedIn} = useAuth();

  // when loggedIn if user refreshes the page wait until interceptor mounts (show loading page first) and then show the pages
  // so that requests are captured by interceptor.
  if(!interceptorReady && isLoggedIn)
    return <LoadingPage />

  return (
    <>
    <ToastContainer />
      <Routes>
        <Route element= {<MainLayout />}>
          <Route path='/home' element={<HomePage />} />
          <Route path='/discover' element={<DiscoverPage />} />
          <Route path='/discover/genre/:genre' element={<SongsByGenrePage />} />
          <Route path='/albums/:albumId' element={<AlbumsPage />} />
          <Route path='/songs/:songId' element={<SongsPage />} />
          <Route path='/songs/comments/:songId' element={<CommentsPage />} />
          { isLoggedIn ? <Route path='*' element={<ErrorPage title='Page not found' 
            description="Looks like something went wrong. Let's get you back to the music"
            status= "404" />} /> : ''
          }
          
        </Route>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/logout' element={<LoggingOutPage />} />
        {!isLoggedIn ? <Route path='*' element={<ErrorPage title='Page not found' 
          description="Looks like something went wrong. Let's get you back to the music"
          status= "404" />} /> : ''
        }
      </Routes>
    </>
  )
}

export default App
