import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchValue): any {

    if (!searchValue) return value;
    //console.log(value);

    //return value.filter((v) => v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || v.address.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    return  value.filter(function(v) {
        if(v.name!=null){
            return v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || v.address.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || v.createdTime.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        } else {
            return "0";
        }
    })
  }

}