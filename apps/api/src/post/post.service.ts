// src/post/post.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create post
  async create({ input, userId }: { input: CreatePostInput; userId: number }) {
    const slug = this.generateSlug(input.title);

    return this.prisma.post.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        thumbnail: input.thumbnail ?? '',
        published: input.published ?? false,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  // ✅ Update post (only owner)
  async update({ input, userId }: { input: UpdatePostInput; userId: number }) {
    const post = await this.prisma.post.findUnique({
      where: { id: input.id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    // Regenerate slug if title changed
    const slug = input.title ? this.generateSlug(input.title) : undefined;

    return this.prisma.post.update({
      where: { id: input.id },
      data: {
        ...(input.title && { title: input.title }),
        ...(slug && { slug }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.thumbnail !== undefined && { thumbnail: input.thumbnail }),
        ...(input.published !== undefined && { published: input.published }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  // ✅ Delete post (only owner or admin)
  async delete(id: number, userId: number, userRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  // ✅ All posts
  async findAll(take: number, skip: number) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      posts,
      total,
      hasNextPage: skip + take < total,
      hasPreviousPage: skip > 0,
    };
  }

  // ✅ NEW: Find single post
  async findById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  // ✅ User posts
  async findByUserId({
    userId,
    take = 10,
    skip = 0,
  }: {
    userId: number;
    take?: number;
    skip?: number;
  }) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { userId },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where: { userId } }),
    ]);

    return {
      posts,
      total,
      hasNextPage: skip + take < total,
      hasPreviousPage: skip > 0,
    };
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Add random suffix to ensure uniqueness
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${suffix}`;
  }
}
