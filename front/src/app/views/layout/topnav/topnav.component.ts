import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { SimpleDialogComponent, InputType } from '../../common/dialogs/simpleDialog.component';
import { Enums, EnumChangePipe } from '../../../common/defines/enums';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    providers: [
        HttpRequestInterceptor,
        DatePipe,
        EnumChangePipe,
    ],
})
export class TopnavComponent implements OnInit {
    // 他コンポーネントのイベント（sidebar.toggle）を実行するため、EventEmitterを使用する
    @Output() toggleSidebar = new EventEmitter();

    constructor(
        public router: Router,
        private translate: TranslateService,
        private http: HttpRequestInterceptor,
        private modalService: NgbModal,
        private datePipe: DatePipe,
        private enumChangePipe: EnumChangePipe,
        ) { }

    ngOnInit() {
        let language = localStorage.getItem('language');
        if (!language) { language = 'en'; }
        this.translate.use(language);
    }

    // ログアウト
    async onLoggedout() {
        // 確認ダイアログの表示
        const result = await SimpleDialogComponent.openConfirmDialog(
            this.modalService,
            'Confirm',
            'Do you want to log out?');
        if (result !== 'ok') { return; }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        this.router.navigate(['/login']);
    }

    // ユーザ情報表示
    async showUserInfo() {
        // ユーザ情報を取得
        const values = JSON.stringify([localStorage.getItem('userId')]);
        const ret: any = await this.http.get('api/common/db?sql=Users/getUser.sql&values=' + values);
        if (ret.message !== null) {
          alert('Get user failed.\n' + ret.message);
          return;
        }
        const data = ret.rows[0];

        // ユーザ情報用のダイアログ表示
        const modalRef = this.modalService.open(SimpleDialogComponent, { backdrop: 'static' });
        const dialog = modalRef.componentInstance as SimpleDialogComponent;
        dialog.title = 'Profile';
        dialog.message = '';
        dialog.items = [
            { label: 'Name', value: data ? data.name : null, inputtype: InputType.Display },
            { label: 'Age', value: data ? data.age : null, inputtype: InputType.Display },
            { label: 'Sex', value: data ? this.enumChangePipe.transform(data.sex, Enums.Sex) : null, inputtype: InputType.Display },
            { label: 'Birthday', value: data ? this.datePipe.transform(data.birthday, 'yyyy/MM/dd') : null, inputtype: InputType.Display },
            { label: 'Note', value: data ? data.note : null, inputtype: InputType.Display },
        ];
        dialog.buttons = [
            { class: 'btn-right', name: 'OK',     click: async () => { dialog.activeModal.close('cancel'); } },
        ];

        // ダイアログの実行待ち
        const result = await modalRef.result;
    }

    // 言語変更
    changeLang(language: string) {
        localStorage.setItem('language', language);
        this.translate.use(language);
    }
}
