// src/like/entities/like.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class LikeStatus {
  @Field()
  isLiked: boolean;

  @Field(() => Int)
  totalLikes: number;
}

// ✅ NEW: For batch query
@ObjectType()
export class PostLikeStatus {
  @Field(() => Int)
  postId: number;

  @Field()
  isLiked: boolean;

  @Field(() => Int)
  totalLikes: number;
}
