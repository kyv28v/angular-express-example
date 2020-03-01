import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import * as crypto from 'crypto-js';

import { HttpRequestInterceptor } from '../../../common/services/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ HttpRequestInterceptor ],
})
export class LoginComponent implements OnInit {

    public userid = '';
    public password = '';

    constructor(
        private router: Router,
        private http: HttpRequestInterceptor,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        let language = localStorage.getItem('language');
        if (!language) { language = 'en'; }
        this.translate.use(language);
    }

    async onLogin() {
        // パスワードのハッシュ化
        const hashedPassword = crypto.SHA512(this.password).toString();

        // トークン生成APIの呼び出し
        const ret: any = await this.http.post('api/common/auth/createtoken', { userid: this.userid, password: hashedPassword });
        if (ret.message) {
            alert(ret.message);
            return;
        }

        localStorage.setItem('accessToken', ret.accessToken);
        localStorage.setItem('refreshToken', ret.refreshToken);
        localStorage.setItem('userId', this.userid);
        this.router.navigate(['/home']);
    }
}
