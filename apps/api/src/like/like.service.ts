// src/like/like.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  // ✅ Toggle like (like/unlike)
  async toggleLike(postId: number, userId: number) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Like
      await this.prisma.like.create({
        data: { userId, postId },
      });
    }

    // Return updated status
    const totalLikes = await this.prisma.like.count({
      where: { postId },
    });

    return {
      isLiked: !existingLike,
      totalLikes,
    };
  }

  // ✅ Get like status for a post
  async getLikeStatus(postId: number, userId?: number) {
    const totalLikes = await this.prisma.like.count({
      where: { postId },
    });

    let isLiked = false;

    if (userId) {
      const like = await this.prisma.like.findUnique({
        where: {
          userId_postId: { userId, postId },
        },
      });
      isLiked = !!like;
    }

    return { isLiked, totalLikes };
  }

  async getLikeStatusBatch(postIds: number[], userId?: number) {
    const likeCounts = await this.prisma.like.groupBy({
      by: ['postId'],
      where: { postId: { in: postIds } },
      _count: true,
    });

    let userLikes: number[] = [];

    if (userId) {
      const likes = await this.prisma.like.findMany({
        where: {
          postId: { in: postIds },
          userId,
        },
        select: { postId: true },
      });
      userLikes = likes.map((l) => l.postId);
    }

    return postIds.map((postId) => ({
      postId,
      totalLikes: likeCounts.find((l) => l.postId === postId)?._count || 0,
      isLiked: userLikes.includes(postId),
    }));
  }
}
