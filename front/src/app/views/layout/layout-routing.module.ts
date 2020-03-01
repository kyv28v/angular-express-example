import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { HomeComponent } from '../pages/home/home.component';
import { UserMngComponent } from '../pages/userMng/userMng.component';
import { RoomAccessMngComponent } from '../pages/roomAccessMng/roomAccessMng.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'userMng',
                component: UserMngComponent
            },
            {
                path: 'roomAccessMng',
                component: RoomAccessMngComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
