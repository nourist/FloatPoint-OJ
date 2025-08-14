import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogComment } from '../../entities/blog-comment.entity';
import { Blog } from '../../entities/blog.entity';
import { MinioModule } from '../minio/minio.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
	imports: [TypeOrmModule.forFeature([Blog, BlogComment]), MinioModule],
	controllers: [BlogController],
	providers: [BlogService],
})
export class BlogModule {}
