import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "appFilterProperty",
  pure: true,
  standalone: true
})
export class FilterPropertyPipe implements PipeTransform {

  transform(value: any[], filter: string, property: string) {
    if (!value || !filter) return value;
    return value.filter(val => {
      return val[property].toLowerCase().includes(filter.toLowerCase());
    });
  }

}
