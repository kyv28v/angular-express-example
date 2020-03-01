import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Pipe({ name: 'enumChange' })
export class EnumChangePipe implements PipeTransform {
  constructor(
    public translate: TranslateService,
  ) { }

  transform(id: any, enums: any): string {
    let dispStr: string;
    for (let i = 0; i < enums.length; i++) {
      if (enums[i].id === id) {
        // 多言語対応
        this.translate.get(enums[i].name).subscribe((res: string) => {
          dispStr = enums[i].id + ':' + res;
        });
        return dispStr;
      }
    }
    return null;
  }
}

export namespace Enums {
  // 性別
  export const Sex = [
    { id: 1, name: 'Man' },
    { id: 2, name: 'Woman' },
  ];
  // 部屋
  export const Rooms = [
    { id: '101', name: 'Controll Room' },
    { id: '102', name: 'Test Room' },
    { id: '103', name: 'Experimental Room' },
    { id: '201', name: 'Work Room' },
    { id: '301', name: 'Storage Room' },
  ];
}
