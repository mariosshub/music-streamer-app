import { useAuth } from "@/providers/AuthProvider"
import { useActionState } from "react";
import { Link } from "react-router";


const LoginPage = () => {
  const {login} = useAuth();

  const submitLoginForm = (_:any, formData: any) => {
    const enteredUsername: string = formData.get('username');
    const enteredPass: string = formData.get('password');

    let errors = {
      username: "",
      password: ""
    }
  
    if( !enteredUsername && enteredUsername.trim() == "")
      errors.username = "* Fill your username"
    
    if(!enteredPass && enteredPass.trim() == "")
      errors.password = "* Fill your password"

    if(errors.username.length > 0 || errors.password.length > 0) {
      return {errors, enteredValues: {
        username: enteredUsername,
        password: enteredPass
      }}
    }

    // validation success login the user
    login(enteredUsername, enteredPass);

    return {errors: null};
  }

  const [formState, formAction, isPending] = useActionState(submitLoginForm, {errors: null})

  return (
    <section className="bg-gradient-to-b from-[#005f5a]/80 via-teal-920/80
					 to-zinc-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-zinc-900 border-zinc-800 rounded-lg shadow border md:mb-20 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action={formAction}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  defaultValue={formState.enteredValues?.username}
                  className={`bg-zinc-800 border ${formState.errors?.username ? 'border-red-700' : 'border-zinc-700'}
                   text-white sm:text-sm rounded-lg focus:border-gray-600 block w-full p-2.5`}
                />
                <p className="text-red-600 text-sm font-thin">{formState.errors?.username}</p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  defaultValue={formState.enteredValues?.password}
                  className={`bg-zinc-800 border ${formState.errors?.password ? 'border-red-700' : 'border-zinc-700'}
                   text-white sm:text-sm rounded-lg focus:border-gray-600 block w-full p-2.5`}
                />
                 <p className="text-red-600 text-sm font-thin">{formState.errors?.password}</p>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-white font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isPending}
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-300">
                Don’t have an account yet?{" "}
                <Link
                  to={"/signup"}
                  className="font-medium text-gray-300 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage