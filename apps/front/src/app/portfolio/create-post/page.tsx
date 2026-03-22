import CreatePostForm from "./createPostForm";

function CreatePost() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Create New Post
        </h1>
        <CreatePostForm />
      </div>
    </main>
  );
}

export default CreatePost;
