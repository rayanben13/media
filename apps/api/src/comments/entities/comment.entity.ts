// src/comment/entities/comment.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => Int)
  postId: number;

  @Field(() => UserEntity)
  user: UserEntity;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Int)
  total: number;

  @Field()
  hasNextPage: boolean;
}
