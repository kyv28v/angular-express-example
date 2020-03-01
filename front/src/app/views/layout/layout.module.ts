import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopnavComponent } from './topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { EnumChangePipe } from '../../common/defines/enums';

import { HomeComponent } from '../pages/home/home.component';
import { UserMngComponent } from '../pages/userMng/userMng.component';
import { RoomAccessMngComponent } from '../pages/roomAccessMng/roomAccessMng.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        TranslateModule,
        FormsModule,
    ],
    declarations: [
        LayoutComponent,
        TopnavComponent,
        SidebarComponent,
        EnumChangePipe,
        HomeComponent,
        UserMngComponent,
        RoomAccessMngComponent,
    ]
})
export class LayoutModule { }
