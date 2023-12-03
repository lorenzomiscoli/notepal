import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "appFilterProperty",
  standalone: true
})
export class FilterPropertyPipe implements PipeTransform {

  transform(value: any[], filter: string, property: string) {
    if (!value || !filter) return value;
    return value.filter(item => {
      if (item[property]) {
        return item[property].toLowerCase().includes(filter.toLowerCase());
      }
    });
  }

}
