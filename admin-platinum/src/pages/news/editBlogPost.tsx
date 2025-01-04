import { newsContext } from "@/context/news-context";
import BlogPostCU from "@/modules/blogPosts/BlogPostCU";

const EditBlogPost = () => {
  const { blogPost } = newsContext();
  return (
    <div>
      <BlogPostCU blogPost={blogPost} />
    </div>
  );
};

export default EditBlogPost;
