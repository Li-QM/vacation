---
title: API Reference

language_tabs:
- bash

- javascript


includes:

search: true

toc_footers:
- <a href='http://github.com/mpociot/documentarian'>Documentation Powered by Documentarian</a>
---
<!-- START_INFO -->
# Info

Welcome to the generated API reference.

<!-- END_INFO -->

#Room Management

APIs for manage listings
<!-- START_2ae96bfc18d52d576c4774ccef9e0ef0 -->
## Create a Room

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/createlisting" \
    -H "Content-Type: application/json" \
    -d '{"latitude":133501608.2668088,"longitude":21.597849532,"active_accommodates":15,"active_home_type":7}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/createlisting");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "latitude": 133501608.2668088,
    "longitude": 21.597849532,
    "active_accommodates": 15,
    "active_home_type": 7
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{
    "status": "success",
    "data": {
        "room_id": 11623,
        "redirect_url": "https:\/\/vacation.rentals\/manage-listing\/11623\/basics"
    }
}
```

### HTTP Request
`POST api/createlisting`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    latitude | float |  required  | The latitute of ther listing. More descriptions.
    longitude | float |  required  | The longitude of ther listing. More descriptions.
    active_accommodates | integer |  required  | The accommodate of ther listing. More descriptions.
    active_home_type | integer |  required  | The home type of ther listing. More descriptions.

<!-- END_2ae96bfc18d52d576c4774ccef9e0ef0 -->

<!-- START_4eb421cc8b5ee1c9d3e71b039ba69e32 -->
## Create or Update bedroom

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/addupdatebedroom" \
    -H "Content-Type: application/json" \
    -d '{"room_id":5,"babycrib":8,"bedroom_id":12,"bedroom_name":"nobis","bunkbed":18,"murphy":2,"nochildbed":15,"noof_king":1,"noof_double":10,"nooqueen":15,"nosleepsofa":3,"twinsingle":15}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/addupdatebedroom");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 5,
    "babycrib": 8,
    "bedroom_id": 12,
    "bedroom_name": "nobis",
    "bunkbed": 18,
    "murphy": 2,
    "nochildbed": 15,
    "noof_king": 1,
    "noof_double": 10,
    "nooqueen": 15,
    "nosleepsofa": 3,
    "twinsingle": 15
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{
    "status": "success",
    "message": "Add Successfully.",
    "result": {
        "room_id": "11623",
        "bedroom_name": "child bedroom",
        "bedroom_details": "{\"king\":\"4\",\"queen\":\"2\",\"double\":null,\"single\":\"4\",\"bunk\":\"2\",\"child\":\"4\",\"sleepsofa\":\"3\",\"murphy\":\"3\",\"babycrib\":\"1\"}",
        "id": 5873
    }
}
```

### HTTP Request
`POST api/addupdatebedroom`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | Room id of listing. More descriptions.
    babycrib | integer |  optional  | More descriptions. More descriptions.
    bedroom_id | integer |  optional  | if exist bedroomid More descriptions.
    bedroom_name | string |  required  | More descriptions.
    bunkbed | integer |  optional  | More descriptions.
    murphy | integer |  optional  | More descriptions.
    nochildbed | integer |  optional  | More descriptions.
    noof_king | integer |  optional  | More descriptions.
    noof_double | integer |  optional  | More descriptions.
    nooqueen | integer |  optional  | More descriptions.
    nosleepsofa | integer |  optional  | More descriptions.
    twinsingle | integer |  optional  | More descriptions.

<!-- END_4eb421cc8b5ee1c9d3e71b039ba69e32 -->

<!-- START_545c3910e101c4f8eb00c056c1a894ae -->
## Create or Update bathroom

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/addupdatebathroom" \
    -H "Content-Type: application/json" \
    -d '{"room_id":9,"bathroom_id":2,"bathfeature":[],"bathroom_name":"in","bathroom_type":"quos"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/addupdatebathroom");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 9,
    "bathroom_id": 2,
    "bathfeature": [],
    "bathroom_name": "in",
    "bathroom_type": "quos"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{
    "message": "Add Successfully.",
    "status": "success",
    "result": {
        "room_id": "11623",
        "bathroom_name": "child bath room",
        "bathroom_type": "Half",
        "bathfeature": "Toilet, Tub,Bidet,Jetted tub, Shower, Outdoor Shower",
        "id": 3450
    }
}
```

### HTTP Request
`POST api/addupdatebathroom`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    bathroom_id | integer |  optional  | If exist bathroom id More descriptions.
    bathfeature | array |  optional  | ["Toilet", "Tub", "Bidet", "Jetted tub", "Shower", "Outdoor Shower"] More descriptions.
    bathroom_name | string |  required  | More descriptions.
    bathroom_type | string |  required  | from ['Half', 'Full', 'Shower'] More descriptions.

<!-- END_545c3910e101c4f8eb00c056c1a894ae -->

<!-- START_effee632ea8b299a0bf19482e545d1e2 -->
## Delete bedroom

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/deletebedroom" \
    -H "Content-Type: application/json" \
    -d '{"bedid:":"enim","room_id:":"quis"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/deletebedroom");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "bedid:": "enim",
    "room_id:": "quis"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```
> Example response (200):


```json
{}
```

### HTTP Request
`POST api/deletebedroom`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    bedid: | 5870 |  optional  | More descriptions.
    room_id: | 11623 |  optional  | More descriptions.

<!-- END_effee632ea8b299a0bf19482e545d1e2 -->

<!-- START_53cc6c8a5ffd1bb1f6c1de01c7f28b22 -->
## Delete bathroom

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/deletebathroom" \
    -H "Content-Type: application/json" \
    -d '{"bathid:":"recusandae","room_id:":"rerum"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/deletebathroom");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "bathid:": "recusandae",
    "room_id:": "rerum"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```
> Example response (200):


```json
{}
```

### HTTP Request
`POST api/deletebathroom`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    bathid: | 3443 |  optional  | More descriptions.
    room_id: | 11623 |  optional  | More descriptions.

<!-- END_53cc6c8a5ffd1bb1f6c1de01c7f28b22 -->

<!-- START_8120c90ca98e324a1d462b6eaf0f3aad -->
## Update listing

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/update_rooms" \
    -H "Content-Type: application/json" \
    -d '{"room_id":6,"name":"aut","summary":"consequatur","video":"porro","booking_type":"voluptas","room_type":"perferendis"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/update_rooms");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 6,
    "name": "aut",
    "summary": "consequatur",
    "video": "porro",
    "booking_type": "voluptas",
    "room_type": "perferendis"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```

### HTTP Request
`POST api/update_rooms`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    name | string |  optional  | More descriptions.
    summary | string |  optional  | More descriptions.
    video | string |  optional  | Youtube video url. More descriptions.
    booking_type | string |  optional  | More descriptions.
    room_type | string |  optional  | More descriptions.

<!-- END_8120c90ca98e324a1d462b6eaf0f3aad -->

<!-- START_f74b0493034a41bc0109e189cdd84fa6 -->
## Update listing Description

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/update_description" \
    -H "Content-Type: application/json" \
    -d '{"room_id":19,"current_tab":"exercitationem","space":"maiores","access":"id","interaction":"architecto","notes":"voluptatibus","house_rules":"voluptatem","neighborhood_overview":"veritatis","transit":"excepturi"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/update_description");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 19,
    "current_tab": "exercitationem",
    "space": "maiores",
    "access": "id",
    "interaction": "architecto",
    "notes": "voluptatibus",
    "house_rules": "voluptatem",
    "neighborhood_overview": "veritatis",
    "transit": "excepturi"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```

### HTTP Request
`POST api/update_description`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    current_tab | string |  optional  | More descriptions.
    space | string |  optional  | More descriptions.
    access | string |  optional  | More descriptions.
    interaction | string |  optional  | More descriptions.
    notes | string |  optional  | More descriptions.
    house_rules | string |  optional  | More descriptions.
    neighborhood_overview | string |  optional  | More descriptions.
    transit | string |  optional  | More descriptions.

<!-- END_f74b0493034a41bc0109e189cdd84fa6 -->

<!-- START_8789cbfb3e37468fdd0c9893510dca13 -->
## Location verify

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/finish_address" \
    -H "Content-Type: application/json" \
    -d '{"room_id":16,"country":"earum","address_line_1":"et","address_line_2":"voluptatem","city":"placeat","state":"sint","postal_code":"qui","latitude":11.5,"longitude":151618363.208469}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/finish_address");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 16,
    "country": "earum",
    "address_line_1": "et",
    "address_line_2": "voluptatem",
    "city": "placeat",
    "state": "sint",
    "postal_code": "qui",
    "latitude": 11.5,
    "longitude": 151618363.208469
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```

### HTTP Request
`POST api/finish_address`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    country | string |  required  | More descriptions.
    address_line_1 | string |  required  | More descriptions.
    address_line_2 | string |  required  | More descriptions.
    city | string |  required  | More descriptions.
    state | string |  required  | More descriptions.
    postal_code | string |  required  | More descriptions.
    latitude | float |  required  | More descriptions.
    longitude | float |  required  | More descriptions.

<!-- END_8789cbfb3e37468fdd0c9893510dca13 -->

<!-- START_747a26bc9433c777d462164152f3aa2c -->
## Update Amenities

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/update_amenities" \
    -H "Content-Type: application/json" \
    -d '{"room_id":"est","amenities":"explicabo"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/update_amenities");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": "est",
    "amenities": "explicabo"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{
    "success": "true"
}
```

### HTTP Request
`POST api/update_amenities`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | More |  optional  | descriptions.
    amenities | string |  optional  | ids combined by comma More descriptions.

<!-- END_747a26bc9433c777d462164152f3aa2c -->

<!-- START_762ed6d0d412dcf76974c9ad4c7a1fcd -->
## Upload Photos

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/add_photos" \
    -H "Content-Type: application/json" \
    -d '{"room_id":8,"photos":{"":"harum"}}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/add_photos");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 8,
    "photos": {
        "": "harum"
    }
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
[]
```

### HTTP Request
`POST api/add_photos`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    photos[] | binary |  optional  | array required More descriptions.

<!-- END_762ed6d0d412dcf76974c9ad4c7a1fcd -->

<!-- START_2c835e2bc5909d2918e07554730af88a -->
## Update price listing

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/update_price" \
    -H "Content-Type: application/json" \
    -d '{"room_id":9,"currency_code":"autem","weekenddays":6,"tax":3110.7,"night":12878888.6,"week":201377.58,"month":2423.3590696,"weekend":41531729.0921,"minimum_stay":19,"cleaning":227.341693,"cleaning_fee_type":20,"security":51821073.6233,"guests":3093.70789,"additional_guest":569804.99185104}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/update_price");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 9,
    "currency_code": "autem",
    "weekenddays": 6,
    "tax": 3110.7,
    "night": 12878888.6,
    "week": 201377.58,
    "month": 2423.3590696,
    "weekend": 41531729.0921,
    "minimum_stay": 19,
    "cleaning": 227.341693,
    "cleaning_fee_type": 20,
    "security": 51821073.6233,
    "guests": 3093.70789,
    "additional_guest": 569804.99185104
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```
> Example response (200):


```json
{}
```

### HTTP Request
`POST api/update_price`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    currency_code | string |  required  | More descriptions.
    weekenddays | integer |  optional  | optional More descriptions.
    tax | float |  optional  | optional More descriptions.
    night | float |  optional  | optional More descriptions.
    week | float |  optional  | optional More descriptions.
    month | float |  optional  | optional More descriptions.
    weekend | float |  optional  | optional More descriptions.
    minimum_stay | integer |  optional  | optional More descriptions.
    cleaning | float |  optional  | optional More descriptions.
    cleaning_fee_type | integer |  optional  | optional More descriptions.
    security | float |  optional  | optional More descriptions.
    guests | float |  optional  | optional More descriptions.
    additional_guest | float |  optional  | optional More descriptions.

<!-- END_2c835e2bc5909d2918e07554730af88a -->

<!-- START_7b6b286e28eef4ba513794a8d41b98c6 -->
## Update additional charges

> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/update_additional_price" \
    -H "Content-Type: application/json" \
    -d '{"room_id":4,"additional_charges":[]}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/update_additional_price");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 4,
    "additional_charges": []
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```

### HTTP Request
`POST api/update_additional_price`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    additional_charges | array |  optional  | More descriptions.

<!-- END_7b6b286e28eef4ba513794a8d41b98c6 -->

<!-- START_352ef742a39dc2c4da1a8348d990ab10 -->
## api/save_reservation
> Example request:

```bash
curl -X POST "http://artemova.vacation.rentals/api/save_reservation" \
    -H "Content-Type: application/json" \
    -d '{"room_id":11,"edit_seasonal_name:":"aut","end_date":"a","guests":"atque","notes":"voluptas","price":"ea","reservation_source":"et","seasonal_name":"veritatis","start_date":"et"}'

```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/save_reservation");

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

let body = {
    "room_id": 11,
    "edit_seasonal_name:": "aut",
    "end_date": "a",
    "guests": "atque",
    "notes": "voluptas",
    "price": "ea",
    "reservation_source": "et",
    "seasonal_name": "veritatis",
    "start_date": "et"
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (200):


```json
{}
```

### HTTP Request
`POST api/save_reservation`

#### Body Parameters

Parameter | Type | Status | Description
--------- | ------- | ------- | ------- | -----------
    room_id | integer |  required  | More descriptions.
    edit_seasonal_name: | &quot;&quot; |  optional  | More descriptions.
    end_date | string |  optional  | "2019-05-22" More descriptions.
    guests | string |  optional  | 1 More descriptions.
    notes | string |  optional  | "444444" More descriptions.
    price | string |  optional  | "433" More descriptions.
    reservation_source | string |  optional  | "Calendar" More descriptions.
    seasonal_name | string |  optional  | "22333333" More descriptions.
    start_date | string |  optional  | "2019-05-05" More descriptions.

<!-- END_352ef742a39dc2c4da1a8348d990ab10 -->

#general
<!-- START_090ef762aee7a868dbf3545f90e45792 -->
## api/getlistings
> Example request:

```bash
curl -X GET -G "http://artemova.vacation.rentals/api/getlistings" 
```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/getlistings");

let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

fetch(url, {
    method: "GET",
    headers: headers,
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (500):


```json
{
    "status": "error",
    "message": "No API Key"
}
```

### HTTP Request
`GET api/getlistings`


<!-- END_090ef762aee7a868dbf3545f90e45792 -->

<!-- START_7d5bfbe67180fbc7ec0bf627521b2500 -->
## api/getListingDetail
> Example request:

```bash
curl -X GET -G "http://artemova.vacation.rentals/api/getListingDetail" 
```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/getListingDetail");

let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

fetch(url, {
    method: "GET",
    headers: headers,
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (500):


```json
{
    "status": "error",
    "message": "No API Key"
}
```

### HTTP Request
`GET api/getListingDetail`


<!-- END_7d5bfbe67180fbc7ec0bf627521b2500 -->

<!-- START_c9dcda1aa0ab37f3dd92ae47b5bb4a34 -->
## api/getlistingpricedetails
> Example request:

```bash
curl -X GET -G "http://artemova.vacation.rentals/api/getlistingpricedetails" 
```

```javascript
const url = new URL("http://artemova.vacation.rentals/api/getlistingpricedetails");

let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}

fetch(url, {
    method: "GET",
    headers: headers,
})
    .then(response => response.json())
    .then(json => console.log(json));
```


> Example response (500):


```json
{
    "status": "error",
    "message": "No API Key"
}
```

### HTTP Request
`GET api/getlistingpricedetails`


<!-- END_c9dcda1aa0ab37f3dd92ae47b5bb4a34 -->


