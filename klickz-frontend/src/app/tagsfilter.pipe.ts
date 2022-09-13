import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByTags'
})
export class TagsFilterPipe implements PipeTransform {

  transform(links: any, tags): any {

    if (!tags) return links;
    //console.log(value);

    //return value.filter((v) => v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || v.address.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
            return  function (items, tags) {
                console.log(items);
                var filtered = []; // Put here only items that match
                (items || []).forEach(function (item) { // Check each item
                    var matches = tags.some(function (tag) {          // If there is some tag
                        return (item.tags.indexOf(tag) > -1);   // of any property's value
                    });                                               // we have a match
                    if (matches) {           // If it matches
                        filtered.push(item); // put it into the `filtered` array
                    }
                });
                return filtered; // Return the array with items that match any tag
            };
   
  }

}