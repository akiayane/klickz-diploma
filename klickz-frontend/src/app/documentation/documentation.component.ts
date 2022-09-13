import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  s0=`
  {
    "address":"https://klic.kz/documentation"
  }`;

  s1=`
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://klic.kz/api/create");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Klickz-api-token", "your-api-token");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => console.log(xhr.responseText);

  let data = {
    "address":"https://klic.kz/documentation"
  };

  xhr.send(data);
  `;

  s2=`
  {
    "payload": {
        "id": 11,
        "name": "https://klic.kz/l/j43G3f2",
        "address": " https://klic.kz/documentation",
        "createdTime": "2022-05-26T17:55:24+06:00"
    }
  }
  `;

  s3=`
  {
    "payload": [
        {
            "id": 3519,
            "linkId": 1,
            "ip": "2.135.55.98",
            "device": "Windows NT 10.0; Win64; x64",
            "country": "Kazakhstan",
            "region": "Nur-Sultan",
            "city": "Nur-Sultan",
            "latitude": "51.180099",
            "longitude": "71.445976",
            "zipcode": "020000",
            "timezone": "+06:00",
            "fullheader": "Sec-Ch-Ua:\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\";User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36;Sec-Fetch-Mode:navigate;Sec-Fetch-User:?1;Referer:http://localhost:4200/;X-Forwarded-For:2.135.55.98;X-Forwarded-Proto:https;Sec-Ch-Ua-Platform:\"Windows\";Upgrade-Insecure-Requests:1;Dnt:1;Sec-Fetch-Dest:document;Connection:close;Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9;Accept-Encoding:gzip, deflate, br;X-Real-Ip:2.135.55.98;Sec-Ch-Ua-Mobile:?0;Sec-Fetch-Site:cross-site;Accept-Language:ru-RU,ru;q=0.9;",
            "createdTime": "2022-05-26T19:19:04+06:00"
        }, … ]
}
  `;

  s4=`
  https://klic.kz/ipparser/get/(ip)`;

  kid=`
  https://klic.kz/api/get/(id)/data`;

  first=`
  https://klic.kz/api/create`;

  s5=`
  {
    "payload": {
        "countryShort": "KZ",
        "countryLong": "Kazakhstan",
        "region": "Nur-Sultan",
        "city": "Nur-Sultan",
        "latitude": "51.180099",
        "longitude": "71.445976",
        "zipcode": "020000",
        "timezone": "+06:00"
    }
}
  `;

  constructor() { }

  ngOnInit(): void {
  }

}
