// src/like/like.resolver.ts
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LikeStatus, PostLikeStatus } from './entities/like.entity';
import { LikeService } from './like.service';

@Resolver()
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  // 🔒 Toggle like (like/unlike)
  @Mutation(() => LikeStatus)
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: User,
  ) {
    return this.likeService.toggleLike(postId, user.id);
  }

  @Query(() => LikeStatus, { name: 'likeStatus' })
  getLikeStatus(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
  ) {
    return this.likeService.getLikeStatus(postId, userId);
  }

  @Query(() => [PostLikeStatus], { name: 'likeStatusBatch' })
  getLikeStatusBatch(
    @Args('postIds', { type: () => [Int] }) postIds: number[],
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
  ) {
    return this.likeService.getLikeStatusBatch(postIds, userId);
  }
}
