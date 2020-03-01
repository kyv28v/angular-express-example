import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    // 他コンポーネントのイベント（sidebar.toggle）を実行するため、EventEmitterを使用する
    @Output() toggleSidebar = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    public selectMenu() {
        // ウインドウ幅が狭いときは、自動的にメニューを隠す
        if (800 >= window.innerWidth) {
            this.toggleSidebar.emit();
        }
    }
}
