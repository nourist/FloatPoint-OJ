import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from 'src/entities/blog.entity';
import { BlogComment } from 'src/entities/blog-comment.entity';

@Module({
	controllers: [BlogController],
	providers: [BlogService],
	imports: [TypeOrmModule.forFeature([Blog, BlogComment])],
})
export class BlogModule {}
