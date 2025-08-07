type songErrors = {
  file: string,
  title: string,
  releasedDate: string,
  genre: string,
  album: string
}

type editSongErrors = {
  releasedDate: string,
  genre: string,
  album: string
}

type albumErrors = {
  title: string,
  releasedYear: string
}

type signupErrors = {
  email: string,
  username: string,
  password: string,
  passwordCheck: string
}

export const checkErrors = (errors:songErrors | editSongErrors | albumErrors | signupErrors) => {
  let errorFound = false;
  Object.entries(errors).forEach(([_, value]) => {
    if(value.length > 0){
      errorFound = true;
    }
  });
  return errorFound;
}