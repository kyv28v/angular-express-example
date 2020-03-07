import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { SimpleDialogComponent, InputType } from '../../common/dialogs/simpleDialog.component';
import { Enums } from '../../../common/defines/enums';

@Component({
  selector: 'app-room-access-mng',
  templateUrl: './roomAccessMng.component.html',
  styleUrls: ['./roomAccessMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class RoomAccessMngComponent implements OnInit {

  public enums = Enums;
  public userList;
  public roomAccessMngs;
  public searchList = '';

  constructor(
    private http: HttpRequestInterceptor,
    private modalService: NgbModal,
  ) { }

  // 画面初期表示
  async ngOnInit() {
    // ユーザ一覧の取得
    const users: any = await this.http.get('api/common/db?sql=Users/getUsers.sql&values=' + JSON.stringify(['']));
    const userList: any[] = users.rows as any[];
    this.userList = userList.map(({id, name}) => ({id, name}));

    // 検索
    await this.searchRoomAccessMng();
  }

  // 検索
  async searchRoomAccessMng() {
    // 検索のクエリを実行
    const values = JSON.stringify([this.searchList]);
    const ret: any = await this.http.get('api/common/db?sql=RoomAccessMng/getRoomAccessMngs.sql&values=' + values);
    if (ret.message !== null) {
      alert('Get room access datetime failed.\n' + ret.message);
      return;
    }

    this.roomAccessMngs = ret.rows;
  }

  // 追加/更新
  // ※ 引数の data が null なら追加、null でなければ更新する
  async regRoomAccessMng(data) {
    // 入退室日時登録用のダイアログ表示
    const modalRef = this.modalService.open(SimpleDialogComponent, { backdrop: 'static' });
    const dialog = modalRef.componentInstance as SimpleDialogComponent;
    dialog.title = 'Register room access datetime';
    dialog.message = '';
    dialog.items = [
      { label: 'Room', value: data?.room_cd, inputtype: InputType.Select, required: true, selectList : Enums.Rooms },
      { label: 'User', value: data?.user_id, inputtype: InputType.Select, required: true, selectList : this.userList },
      { label: 'EntryDateTime', value: data?.entry_dt, inputtype: InputType.DateTime, required: true, placeholder: '2020/01/01 09:00' },
      { label: 'ExitDateTime', value: data?.exit_dt, inputtype: InputType.DateTime, required: false, placeholder: '2020/01/02 18:00' },
      { label: 'Note', value: data?.note, inputtype: InputType.TextArea, required: false, placeholder: '' },
    ];
    dialog.buttons = [
      { class: 'btn-left',  name: 'Cancel', click: async () => { dialog.activeModal.close('cancel'); } },
      { class: 'btn-right', name: 'OK',     click: async () => { this.regRoomAccessMngExec(data, dialog); } },
    ];

    // ダイアログの実行待ち
    const result = await modalRef.result;
    if (result !== 'ok') { return; }

    // 再検索
    await this.searchRoomAccessMng();
  }
  // 追加/更新（ダイアログ側で実行される処理）
  async regRoomAccessMngExec(data: any, dialog: SimpleDialogComponent) {
    // 入力チェック
    if (dialog.validation() === false) { return; }

    // 確認ダイアログの表示
    const result = await SimpleDialogComponent.openConfirmDialog(
      this.modalService,
      'Confirm',
      'Do you want to register room access datetime?');
    if (result !== 'ok') { return; }

    // APIの呼び出し
    const room_cd = dialog.items[0].value;
    const user_id = dialog.items[1].value;
    const entry_dt = dialog.items[2].value;
    const exit_dt = dialog.items[3].value;
    const note = dialog.items[4].value;

    // 追加/更新のクエリを実行
    let body;
    if (data) {
      body = { sql: 'RoomAccessMng/updRoomAccessMng.sql', values: [room_cd, user_id, entry_dt, exit_dt, note, data.id] };
    } else {
      body = { sql: 'RoomAccessMng/addRoomAccessMng.sql', values: [room_cd, user_id, entry_dt, exit_dt, note] };
    }
    const ret: any = await this.http.post('api/common/db', body);
    if (ret.message !== null) {
      alert('Register room access datetime failed.\n' + ret.message);
      return;
    }

    dialog.activeModal.close('ok');
  }

  // 削除
  async delRoomAccessMng(data) {
    // 確認ダイアログの表示
    const result = await SimpleDialogComponent.openConfirmDialog(
      this.modalService,
      'Confirm',
      'Do you want to delete room access datetime?');
    if (result !== 'ok') { return; }

    // 削除のクエリを実行
    const body = { sql: 'RoomAccessMng/delRoomAccessMng.sql', values: [data.id] };
    const ret: any = await this.http.post('api/common/db', body);
    if (ret.message !== null) {
      alert('Delete room access datetime failed\n' + ret.message);
      return;
    }

    // 再検索
    await this.searchRoomAccessMng();
  }
}
