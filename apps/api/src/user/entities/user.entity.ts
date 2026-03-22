import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from './../../post/entities/post.entity';

@ObjectType()
export class UserEntity {
  @ApiProperty({ description: 'User ID' })
  @Field(() => Int)
  id: number;

  @ApiProperty({ description: 'User name' })
  @Field()
  name: string;

  @ApiProperty({ description: 'User email' })
  @Field()
  email: string;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  bio?: string;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Like])
  likes: Like[];
}
