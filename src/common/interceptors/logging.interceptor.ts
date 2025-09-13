import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest(); // get incoming HTTP request
        const method = req.method; // GET, POST, PUT, DELETE
        const url = req.url; // requested URL
        const now = Date.now(); // start time

        return next.handle().pipe(
            tap(() => console.log(`${method} ${url} - ${Date.now() - now}ms`)),
        );
    }
}
