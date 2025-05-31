import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import AuthForm from "@/components/auth/AuthForm";

export type AuthPageProps = {
  type: "sign-in" | "sign-up";
};

const AuthPage = ({ type }: AuthPageProps) => {
  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <AuthForm type={type} />
      </section>
    </AnimationWrapper>
  );
};

export default AuthPage;
