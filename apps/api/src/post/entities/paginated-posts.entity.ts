// src/post/entities/paginated-posts.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Int)
  total: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
