import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "appLineClamp",
  standalone: true
})
export class LineClampPipe implements PipeTransform {

  transform(value: string) {
    if (!value) return;
    let values = value.split('\n');
    if (values.length >= 10) {
      value = values.slice(0, 10).join('\n') + '\n...';
    }
    return value;
  }

}
