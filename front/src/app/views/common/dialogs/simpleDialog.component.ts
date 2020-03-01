import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import flatpickr from 'flatpickr';
import { english } from 'flatpickr/dist/l10n/default';
import { Japanese } from 'flatpickr/dist/l10n/ja';

export namespace InputType {
  export const Display = 'display';
  export const Text = 'text';
  export const Password = 'password';
  export const TextArea = 'textarea';
  export const Date = 'date';
  export const DateTime = 'datetime';
  export const Select = 'select';
  export const Radio = 'radio';
}

@Component({
  selector: 'app-simple-dialog-content',
  templateUrl: './simpleDialog.component.html',
})
export class SimpleDialogComponent {
  @Input() title;
  @Input() message;
  @Input() item;
  @Input() items;
  @Input() buttons;

  // 確認メッセージの表示
  public static async openConfirmDialog(
    modalService: NgbModal,
    title: string,
    message: string,
    ) {
    const modalRef = modalService.open(SimpleDialogComponent);
    const confirmDialog = modalRef.componentInstance as SimpleDialogComponent;
    confirmDialog.title = title;
    confirmDialog.message = message;
    confirmDialog.buttons = [
      { class: 'btn-left',  name: 'Cancel', click: async () => { confirmDialog.activeModal.close('cancel'); } },
      { class: 'btn-right', name: 'OK',     click: async () => { confirmDialog.activeModal.close('ok');     } },
    ];

    const result = await modalRef.result;
    return result;
  }

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {
    // カレンダーの言語設定
    if (localStorage.getItem('language') === 'ja') {
      flatpickr.localize(Japanese);
    } else {
      flatpickr.localize(english);
    }
    // カレンダーを日曜日スタートにする
    flatpickr.l10ns.default.firstDayOfWeek = 0;
  }

  // 入力チェック
  public validation(): boolean {
    let ret = true;

    if (this.items !== undefined) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].validateMessage = '';
        if (this.items[i].required === true && (!this.items[i].value)) {
          this.items[i].validateMessage = '入力必須です。';
          ret = false;
        }
      }
    }
    return ret;
  }

}
