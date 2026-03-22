import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class UserRespo {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  role: Role;
  @Field({ nullable: true })
  avatar?: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  user: UserRespo;
  @Field()
  accessToken: string;
}
