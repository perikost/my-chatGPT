import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../chat/chat.service';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(values: any [], property: string, target: any): any [] {
    return values.filter(value => value[property] === target);
  }

}
