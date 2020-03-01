import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

  async get(url: string) {
    const request = new HttpRequest('GET', url);
    return await this.callAPI(request);
  }

  async post(url: string, body: any) {
    const request = new HttpRequest('POST', url, body);
    return await this.callAPI(request);
  }

  // APIの呼び出し
  async callAPI(request: any) {
    try {
      // アクセストークンをヘッダーに埋め込む
      // ※ ヘッダーに null をセットするとエラーになるので、nullの場合は''をセットする
      const accessToken = localStorage.getItem('accessToken') || '';
      const accessRequest = request.clone({ headers: request.headers.set('access-token', accessToken) });

      // リクエスト実行。成功なら、応答データをそのまま返す。
      const ret: any = await this.http.request(accessRequest).toPromise();
      return ret.body;
    } catch (e) {
      // ネットワークエラーの処理
      if (e instanceof HttpErrorResponse) {
        // 権限エラーの場合、リフレッシュトークンによるトークン更新を試みる
        if (e.status === 401) {
          const retRefresh = await this.refreshToken();
          if (retRefresh) {
            // 成功した場合、再度APIを呼び出す
            return await this.callAPI(request);
          }
        }
      }
      // それ以外のエラーの場合、そのままthrowする
      throw e;
    }
  }

  // トークンの更新処理
  async refreshToken() {
    try {
      // リフレッシュトークンをヘッダーに埋め込む
      // ※ ヘッダーに null をセットするとエラーになるので、nullの場合は''をセットする
      const refreshToken = localStorage.getItem('refreshToken') || '';
      let refreshHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
      refreshHeaders = refreshHeaders.set('refresh-token', refreshToken);

      // リクエスト実行。成功なら、応答データをそのまま返す。
      const refresh: any = await this.http.post('api/common/auth/refreshtoken', null, { headers: refreshHeaders }).toPromise();
      localStorage.setItem('accessToken', refresh.accessToken);
      return true;
    } catch (e) {
      // ネットワークエラーの処理
      if (e instanceof HttpErrorResponse) {
        if (e.status === 401) {
          // 権限エラーの場合、エラー表示してログイン画面に戻る
          alert('Session has expired. Please log in again.');
          this.router.navigate(['/login']);
          return false;
        }
      }
      // それ以外のエラーの場合、とりあえずalert表示
      alert(e);
      return false;
    }
  }

  // intercept内でトークンなどの処理をするつもりだったが、余計煩雑になってしまったので、呼び出し処理をラップして実装するよう変更した。
  // とりあえずここは何もせずに素通り。
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request);
  //   let req: HttpRequest<any>;

  //   if (request.url.match(/^api\/common\/auth\/refreshtoken/)) {   // 'api/common/auth/refresh_token'
  //     // リフレッシュトークンをヘッダーに埋め込む
  //     // ※ ヘッダーに null をセットするとエラーになるので、nullの場合は''をセットする
  //     const token = localStorage.getItem('refreshToken') || '';
  //     req = request.clone({
  //       setHeaders: {
  //         'Content-Type': 'application/json',
  //         'refresh-token': token,
  //       },
  //     });
  //   } else if (request.url.match(/^api\//)) {         // 'api/'から始まるリクエスト
  //     // アクセストークンをヘッダーに埋め込む
  //     // ※ ヘッダーに null をセットするとエラーになるので、nullの場合は''をセットする
  //     const token = localStorage.getItem('accessToken') || '';
  //     req = request.clone({
  //       setHeaders: {
  //         'Content-Type': 'application/json',
  //         'access-token': token,
  //       },
  //     });
  //   } else {
  //     req = request;
  //   }

  //   // リクエストの実行
  //   return next.handle(req).pipe(
  //     // エラー処理
  //     catchError(res => {
  //       alert(res.status + 'error.');
  //       switch (res.status) {
  //         case 401:
  //           // 401エラーの場合、トークンを更新する？
  //           this.router.navigate(['/login']);
  //           return throwError(res);
  //           break;
  //         case 400:
  //         case 403:
  //         case 404:
  //         case 500:
  //           return throwError(res);
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   ));
  }
}
