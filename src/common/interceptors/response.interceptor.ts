import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Res } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { Response_MESSAGE, Response_OPTS, ResponseOpts } from '../decorators/response.decorator';
import { statusConstant } from 'src/constants/status.constant';
import { access } from 'fs';

type Envelope<T> = {
  status: 'success' | 'error';
  code: number;
  message: string;
  data: T;
  meta?:{
    total: number,
    page: number,
    limit: number,
    totalPage: number,
    nextPage: number | null
    previousPage: number | null
  }
}

function defaultMessageByStatusCode(code: number) {
  switch (code) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 500:
      return 'Internal Server Error';
    default:
      return 'Unknown Error';
  }
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Envelope<T>> {
  constructor(private readonly reflector: Reflector) {}

  private calmelToSnake(obj: any, keyName?: string): any {
    if (obj instanceof Date) {
      if (keyName && /_date$/.test(keyName) ) {
        return obj.toISOString().split('T')[0];
      }
      return obj.toISOString;
    }
    if (obj ===  null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.calmelToSnake(item));
    }
    return obj.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const snakeKey: string  = key.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
        return [snakeKey, this.calmelToSnake(value, snakeKey)];
      }),
    );
    
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<Envelope<T>> {
    const http = context.switchToHttp();
    const res = http.getResponse();
    const messageMeta  = this.reflector.getAllAndOverride<string>(Response_MESSAGE, [
      context.getHandler(),
      context.getClass(),
    ])
    const optsMeta  = this.reflector.getAllAndOverride<ResponseOpts>(Response_OPTS, [
      context.getHandler(),
      context.getClass(),
    ])
    if (optsMeta?.Code) res.statusCode = optsMeta.Code;
    return next.handle().pipe(
      map((raw ) => { 
        const code = res.statusCode || 200;
        const message  = optsMeta?.message ?? messageMeta ?? defaultMessageByStatusCode(code); 
        const ispagination = 
        raw && 
        typeof raw === 'object' && 
        Array.isArray(raw.data) &&
        Number.isFinite(raw.count) &&
        Number.isFinite(raw.pageSize) &&
        Number.isFinite(raw.page);

        if (ispagination) { 
          const rows = raw.data;
          const total = Number(raw.count)
          const page = Number(raw.page)
          const limit = Number(raw.pageSize)
          const totalPage = limit > 0 ? Math.ceil(total / limit) : 0;
          const nextPage = page < totalPage ? page + 1 : null;
          const previousPage = page > 1 ? page - 1 : null;
          return {
            code,
            status: statusConstant.SUCCESS,
            message,
            data: this.calmelToSnake(rows),
            meta: {
              total,
              page,
              limit,
              totalPage,
              nextPage,
              previousPage,
            }
          } as any
        }
        const isauthPayload = raw && typeof raw === 'object' && 'accesss_token' in raw;
        if (optsMeta?.liftToken && isauthPayload) {
          return {
            code,
            status: statusConstant.SUCCESS,
            message,
            data: this.calmelToSnake(raw),
            accesss_token: raw.accesss_token,
          }as any
        }
        return {
          code,
          status: statusConstant.SUCCESS,
          message,
          data: this.calmelToSnake(raw),
        }
      })
    )
  }
}
