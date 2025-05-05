import AuthForm from "@/feature/auth/AuthForm";

export type AuthPageProps = {
  type: "sign-in" | "sign-up";
};

const AuthPage = ({ type }: AuthPageProps) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <AuthForm type={type} />
    </section>
  );
};

export default AuthPage;
