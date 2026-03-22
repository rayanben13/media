import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;
}
