import { Component, OnInit, NgZone } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    public sidenavOpened = true;

    constructor(private ngZone: NgZone) {
        window.onresize = (e) => {
            ngZone.run(() => {
                this.resizeWindow(window.innerWidth);
            });
        };
    }

    ngOnInit() {
        this.resizeWindow(window.innerWidth);
    }

    private resizeWindow(width: number) {
        // ウインドウ幅が狭いときは、自動的にメニューを隠す
        if (800 < width) {
          this.sidenavOpened = true;
        } else {
          this.sidenavOpened = false;
        }
    }
}
