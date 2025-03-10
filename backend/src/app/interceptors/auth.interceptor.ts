import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// Get the auth token
		const token = localStorage.getItem("token");

		// Clone the request and add auth header if token exists
		const authReq = token
			? request.clone({
					headers: request.headers.set("Authorization", `Bearer ${token}`),
					withCredentials: true,
			  })
			: request.clone({
					withCredentials: true,
			  });

		// Pass on the cloned request
		return next.handle(authReq);
	}
}
