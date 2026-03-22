export type Post = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnail: string | null;
  published: boolean;
  user: User;
  userId: number;
  comments?: Comment[];
  tags?: Tag[];
  likes?: Like[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  posts: Post[];
  comments: Comment[];
};

export type Comment = {
  id: number;
  content: string;
  user: User;
  userId: number;
  post: Post;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: number;
  name: string;
  posts: Post[];
};

export type Like = {
  id: number;
  user: User;
  userId: number;
  post: Post;
  postId: number;
};
