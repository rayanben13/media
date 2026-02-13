import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  async findAll() {
    await this.prisma.post.findMany();
  }
}
