import { useAuth } from "@/providers/AuthProvider";
import { checkErrors } from "@/utils/checkErrors";
import { useActionState } from "react";

const SignupPage = () => {
  const {signUp} = useAuth();

  const submitSignupForm = (_:any, formData: any) => {
    const enteredEmail: string = formData.get('email');
    const enteredUsername: string = formData.get('username');
    const enteredPass: string = formData.get('password');
    const enteredPassCheck: string = formData.get('passwordCheck');

    let errors = {
      email: "",
      username: "",
      password: "",
      passwordCheck: ""
    }

    if(!enteredEmail && enteredEmail.trim() == "")
      errors.email = "* Fill your email"
    
    if(!enteredUsername && enteredUsername.trim() == "")
      errors.username = "* Fill your username"
    
    if((!enteredPass && enteredPass.trim() == "") || enteredPass.length < 6 )
      errors.password = "* Provide a password containing at least 6 characters.";

    if(!(enteredPass === enteredPassCheck)) {
      errors.passwordCheck = "* Passwords should match!"
    }

    if(checkErrors(errors)) {
      return {errors, enteredValues: {
        email: enteredEmail,
        username: enteredUsername,
        password: enteredPass,
        passwordCheck: enteredPassCheck
      }}
    }

    // validation success login the user
    signUp(enteredEmail, enteredUsername, enteredPass);

    return {errors: null};
  }

  const [formState, formAction, isPending] = useActionState(submitSignupForm, {errors: null})

  return (
    <section className="bg-gradient-to-b from-[#005f5a]/80 via-teal-920/80
					 to-zinc-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-zinc-900 border-zinc-800 rounded-lg shadow border md:mb-20 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
              Sign up form
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action={formAction}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@mail.com"
                  defaultValue={formState.enteredValues?.email}
                  className={`bg-zinc-800 border ${formState.errors?.email ? 'border-red-700' : 'border-zinc-700'}
                   text-white sm:text-sm rounded-lg focus:border-gray-600 block w-full p-2.5`}/>
                <p className="text-red-600 text-sm font-thin">{formState.errors?.email}</p>
              </div>
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
              <div>
                <label
                  htmlFor="passwordCheck"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Validate Password
                </label>
                <input
                  type="password"
                  id="passwordCheck"
                  name="passwordCheck"
                  placeholder="••••••••"
                  defaultValue={formState.enteredValues?.passwordCheck}
                  className={`bg-zinc-800 border ${formState.errors?.passwordCheck ? 'border-red-700' : 'border-zinc-700'}
                   text-white sm:text-sm rounded-lg focus:border-gray-600 block w-full p-2.5`}
                />
                <p className="text-red-600 text-sm font-thin">{formState.errors?.passwordCheck}</p>
              </div>
              <div className="flex items-center">
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isPending}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage