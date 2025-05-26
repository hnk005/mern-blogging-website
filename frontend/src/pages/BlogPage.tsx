import { useParams } from "react-router-dom";
import AnimationWrapper from "@/components/animation/AnimationWrapper";
import BlogProvider from "@/context/BlogContext";
import BlogWrapper from "@/feature/blog/BlogWrapper";

const BlogPage = () => {
  const { blog_id } = useParams();

  return (
    <AnimationWrapper>
      <BlogProvider blogId={blog_id ?? ""}>
        <BlogWrapper />
      </BlogProvider>
    </AnimationWrapper>
  );
};

export default BlogPage;
