import { notFound } from "next/navigation";

export default function BlogPostPage() {
  // Blog posts will be fetched from database in production
  notFound();
}
