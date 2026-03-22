// src/comment/dto/create-comment.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => Int)
  @IsInt()
  postId: number;
}
