import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CommentService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment, PaginatedComments } from './entities/comment.entity';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentService) {}

  // @Mutation(() => Comment)
  // createComment(
  //   @Args('createCommentInput') createCommentInput: CreateCommentInput,
  // ) {
  //   return this.commentsService.create(createCommentInput);
  // }

  @Query(() => PaginatedComments, { name: 'comments' })
  findAll(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 4 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.commentsService.findAll({ take, skip, postId });
  }

  @Mutation(() => Comment, { name: 'createComment' })
  @UseGuards(JwtAuthGuard)
  createComment(
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(input, user.id);
  }
}
