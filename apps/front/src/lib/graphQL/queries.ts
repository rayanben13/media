import gql from "graphql-tag";

// lib/graphQL/queries.ts
export const GET_POSTS_QUERY = gql`
  query GetPosts($take: Int, $skip: Int) {
    posts(take: $take, skip: $skip) {
      posts {
        id
        title
        thumbnail
        slug
        content
        createdAt
      }
      total
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_POST_QUERY = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      slug
      content
      thumbnail
      createdAt
      user {
        id
        name
        avatar
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        name
        email
        role
        avatar
      }
      accessToken
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signUp($input: SignupInput!) {
    signUp(input: $input) {
      accessToken
    }
  }
`;

export const POST_COMMENTS_QUERY = gql`
  query PostComments($postId: Int!, $take: Int, $skip: Int) {
    comments(postId: $postId, take: $take, skip: $skip) {
      comments {
        id
        content
        createdAt
        user {
          id
          name
          avatar
        }
      }
      total
      hasNextPage
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      postId
      createdAt
      user {
        id
        name
        avatar
      }
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($postId: Int!) {
    toggleLike(postId: $postId) {
      isLiked
      totalLikes
    }
  }
`;

export const GET_LIKE_STATUS = gql`
  query GetLikeStatus($postId: Int!, $userId: Int) {
    likeStatus(postId: $postId, userId: $userId) {
      isLiked
      totalLikes
    }
  }
`;

// ✅ NEW: Batch query
export const GET_LIKE_STATUS_BATCH = gql`
  query GetLikeStatusBatch($postIds: [Int!]!, $userId: Int) {
    likeStatusBatch(postIds: $postIds, userId: $userId) {
      postId
      isLiked
      totalLikes
    }
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: Int!, $take: Int, $skip: Int) {
    userPosts(userId: $userId, take: $take, skip: $skip) {
      posts {
        id
        title
        slug
        content
        thumbnail
        createdAt
        user {
          id
          name
          avatar
        }
      }
      total
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts($take: Int, $skip: Int) {
    myPosts(take: $take, skip: $skip) {
      posts {
        id
        title
        slug
        content
        thumbnail
        createdAt
      }
      total
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      slug
      content
      thumbnail
      createdAt
      user {
        id
        name
        avatar
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      title
      slug
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;
