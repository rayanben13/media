import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PaginatedPosts } from './entities/paginated-posts.entity';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput, @CurrentUser() user) {
    return this.postService.create({ input, userId: user.id });
  }

  // ✅ Update post (protected - owner only)
  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  updatePost(@Args('input') input: UpdatePostInput, @CurrentUser() user) {
    return this.postService.update({ input, userId: user.id });
  }

  // ✅ Delete post (protected - owner or admin)
  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  deletePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postService.delete(id, user.id, user.role);
  }

  @Query(() => PaginatedPosts, { name: 'posts' })
  findAll(
    @Args('take', { type: () => Int, nullable: true, defaultValue: 10 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.postService.findAll(take, skip);
  }

  @Query(() => Post, { name: 'post' })
  findById(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedPosts, { name: 'userPosts' })
  findByUserId(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 10 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.postService.findByUserId({ userId, take, skip });
  }

  // ✅ My posts (protected - current user's posts)
  @Query(() => PaginatedPosts, { name: 'myPosts' })
  @UseGuards(JwtAuthGuard)
  findMyPosts(
    @CurrentUser() user: any,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 10 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.postService.findByUserId({ userId: user.id, take, skip });
  }
}
