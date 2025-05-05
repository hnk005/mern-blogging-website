import InputBox from "@/components/ui/InputBox";
import { AuthPageProps } from "@/pages/AuthPage";
import googleIcon from "@/assets/google.png";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { Formik, Form, ErrorMessage } from "formik";
import { SignInSchema, SignUpSchema } from "./AuthFormSchema";

type SignInValues = {
  email: string;
  password: string;
};

type SignUpValues = {
  fullname: string;
  email: string;
  password: string;
};

const AuthForm = ({ type }: AuthPageProps) => {
  const isSignIn = type === "sign-in";

  const initialValues: SignInValues | SignUpValues = isSignIn
    ? {
        email: "",
        password: "",
      }
    : {
        fullname: "",
        email: "",
        password: "",
      };
  const validationSchema = isSignIn ? SignInSchema : SignUpSchema;

  const handleSubmit = (values: SignInValues | SignUpValues) => {
    console.log("Form data:", values);
    // call API or whatever
  };

  return (
    <div className="w-[80%] max-w-[400px]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
              {isSignIn ? "Welcome back" : "Join us today"}
            </h1>

            {!isSignIn && (
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon="fi-rr-user"
              />
            )}

            <InputBox
              name="email"
              type="email"
              placeholder="Email"
              icon="fi-rr-envelope"
            />

            <InputBox
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />

            <button
              type="submit"
              className="btn-dark center mt-14"
              disabled={isSubmitting}
            >
              {type.replace("-", " ")}
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button
              type="button"
              className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            >
              <img src={googleIcon} alt="google icon" className="w-5" />
              Continue with Google
            </button>

            {isSignIn ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account?
                <Link
                  to={paths.signup}
                  className="underline text-black text-xl ml-1"
                >
                  Join us today.
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a member?
                <Link
                  to={paths.signin}
                  className="underline text-black text-xl ml-1"
                >
                  Sign in here.
                </Link>
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm;
