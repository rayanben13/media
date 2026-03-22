import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsResolver } from './comments.resolver';
import { CommentService } from './comments.service';

@Module({
  providers: [CommentsResolver, CommentService, PrismaService],
})
export class CommentsModule {}
