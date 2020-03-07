import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as crypto from 'crypto-js';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { SimpleDialogComponent, InputType } from '../../common/dialogs/simpleDialog.component';
import { Enums } from '../../../common/defines/enums';

@Component({
  selector: 'app-usermng',
  templateUrl: './userMng.component.html',
  styleUrls: ['./userMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class UserMngComponent implements OnInit {

  public enums = Enums;
  public users;
  public searchText = '';

  constructor(
    private http: HttpRequestInterceptor,
    private modalService: NgbModal,
  ) { }

  // 画面初期表示
  async ngOnInit() {
     // 検索
     await this.searchUser();
  }

  // 検索
  async searchUser() {
    // 検索のクエリを実行
    const values = JSON.stringify([this.searchText]);
    const ret: any = await this.http.get('api/common/db?sql=Users/getUsers.sql&values=' + values);
    if (ret.message !== null) {
      alert('Get users failed.\n' + ret.message);
      return;
    }

    this.users = ret.rows;
  }

  // 追加/更新
  // ※ 引数の user が null なら追加、null でなければ更新する
  async regUser(data) {
    // ユーザ登録用のダイアログ表示
    const modalRef = this.modalService.open(SimpleDialogComponent, { backdrop: 'static' });
    const dialog = modalRef.componentInstance as SimpleDialogComponent;
    dialog.title = 'Register user';
    dialog.message = '';
    dialog.items = [
      { label: 'Name', value: data?.name, inputtype: InputType.Text, required: true, placeholder: 'John Smith' },
      { label: 'Age', value: data?.age, inputtype: InputType.Text, required: true, placeholder: '20' },
      { label: 'Sex', value: data?.sex, inputtype: InputType.Radio, required: false, placeholder: '', selectList : Enums.Sex },
      { label: 'Birthday', value: data?.birthday, inputtype: InputType.Date, required: false, placeholder: '1990/01/01' },
      { label: 'Password', value: data ? '●●●●●●' : null, inputtype: data ? InputType.Display : InputType.Password, required: false, placeholder: '' },
      { label: 'Note', value: data?.note, inputtype: InputType.TextArea, required: false, placeholder: '' },
    ];
    dialog.buttons = [
      { class: 'btn-left',  name: 'Cancel', click: async () => { dialog.activeModal.close('cancel'); } },
      { class: 'btn-right', name: 'OK',     click: async () => { this.regUserExec(data, dialog); } },
    ];

    // ダイアログの実行待ち
    const result = await modalRef.result;
    if (result !== 'ok') { return; }

    // 再検索
    await this.searchUser();
  }
  // 追加/更新（ダイアログ側で実行される処理）
  async regUserExec(data: any, dialog: SimpleDialogComponent) {
    // 入力チェック
    if (dialog.validation() === false) { return; }

    // 確認ダイアログの表示
    const result = await SimpleDialogComponent.openConfirmDialog(
      this.modalService,
      'Confirm',
      'Do you want to register user?');
    if (result !== 'ok') { return; }

    // APIの呼び出し
    const name = dialog.items[0].value;
    const age = dialog.items[1].value;
    const sex = dialog.items[2].value;
    const birthday = dialog.items[3].value;
    const password = dialog.items[4].value;
    const note = dialog.items[5].value;


    // 追加/更新のクエリを実行
    let body;
    if (data) {
      body = { sql: 'Users/updUser.sql', values: [name, age, sex, birthday, note, data.id] };
    } else {
      // パスワードのハッシュ化
      const hashedPassword = crypto.SHA512(password).toString();
      body = { sql: 'Users/addUser.sql', values: [name, age, sex, birthday, hashedPassword, note] };
    }
    const ret: any = await this.http.post('api/common/db', body);
    if (ret.message !== null) {
      alert('Register user failed.\n' + ret.message);
      return;
    }

    dialog.activeModal.close('ok');
  }

  // 削除
  async delUser(data) {
    // 確認ダイアログの表示
    const result = await SimpleDialogComponent.openConfirmDialog(
      this.modalService,
      'Confirm',
      'Do you want to delete user?');
    if (result !== 'ok') { return; }

    // 削除のクエリを実行
    const body = { sql: 'Users/delUser.sql', values: [data.id] };
    const ret: any = await this.http.post('api/common/db', body);
    if (ret.message !== null) {
      alert('Delete user failed.\n' + ret.message);
      return;
    }

    // 再検索
    await this.searchUser();
  }
}
