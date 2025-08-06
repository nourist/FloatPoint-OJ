import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	intercept<T>(_: ExecutionContext, next: CallHandler<T>): Observable<T> {
		return next.handle().pipe(
			map((res: T): T => {
				if (res && typeof res === 'object' && !Array.isArray(res)) {
					const transformed = {} as Record<keyof T, unknown>;

					for (const key of Object.keys(res) as (keyof T)[]) {
						const value = res[key];
						transformed[key] = value && typeof value === 'object' ? instanceToPlain(value) : value;
					}

					return transformed as T;
				}

				return res;
			}),
		);
	}
}
