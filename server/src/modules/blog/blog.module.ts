import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogComment } from 'src/entities/blog-comment.entity';
import { Blog } from 'src/entities/blog.entity';

@Module({
	controllers: [BlogController],
	providers: [BlogService],
	imports: [TypeOrmModule.forFeature([Blog, BlogComment])],
})
export class BlogModule {}
