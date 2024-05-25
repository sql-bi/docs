---
layout:     page
title:      Pools
published:  true
order:      /2
---
The `Pool` object represent the sets of licenses purchased for specific SQLBI courses. It details the number of total, assigned, and available licenses, along with their transferability and validity period. 

Each pool is associated with a specific course. When a license is assigned to a user, it is taken from the pool's available licenses count. If the pool is transferable, the license can be returned to the pool. When this happens, the license becomes inactive and the pool's available licenses count is incremented. If the pool is not transferable, the license cannot be returned to the pool.

## Endpoints

`GET https://www.sqlbi.com/api/licensing/v1/pools`

`GET https://www.sqlbi.com/api/licensing/v1/pool/{id}`

`GET https://www.sqlbi.com/api/licensing/v1/pool/{id}/licenses`

`POST https://www.sqlbi.com/api/licensing/v1/pool/{id}/license`

> Each endpoint is authenticated using a bearer token. The token must be included in the *Authorization* header of the request. See more in the [Authentication](index#authentication) section.


### `GET` / v1 / pools
Retrieve information about all license pools. Here is how to make this request using curl:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/pools" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
A JSON array of objects, each representing a license pool. See the `Pool` object response below for more details.

#### Response Fields
See the `Pool` object fields below for a description of each field.


### `GET` / v1 / pool / {id}
Retrieve detailed information about a specific license pool by providing the pool ID:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/pool/21" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
A JSON object detailing the specific license pool, including the course information and licensing details. 

```json
// Pool #21
{
    "id": "21",
    "course": {
        "id": "37571",
        "title": "Mastering DAX Video Course"
    },
    "start": "2022-11-13T19:46:06+00:00",
    "end": "2025-11-13T00:00:00+00:00",
    "transferable": false,
    "licenses": 10,
    "assignedLicenses": 1,
    "availableLicenses": 9
}
```

#### Response Fields
Each `Pool` object contains the following fields:

- `id`: The unique identifier for the license pool.
- `course`: An object containing:
    - `id`: The unique course identifier.
    - `title`: The name of the course.
- `start`: The start date and time of the license validity period in ISO 8601 format.
- `end`: The end date and time of the license validity period in ISO 8601 format.
- `transferable`: A boolean indicating whether the licenses in this pool are transferable (true) or untransferable (false). [See the difference](https://www.sqlbi.com/transferable-video-course-licenses/). 
- `licenses`: The total number of licenses within the pool.
- `assignedLicenses`: The number of licenses that have been assigned to students.
- `availableLicenses`: The number of licenses remaining in the pool that can be assigned to new students.


### `GET` / v1 / pool / {id} / licenses
Retrieve a list of assigned licenses within a specific pool. Supports pagination and filtering inactive licenses.

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/pool/26/licenses" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Query Parameters

- `page`: (Optional) The page number to retrieve. Default is `1`.
- `pageSize`: (Optional) The number of licenses to retrieve per page. Default is `10`.
- `includeInactive`: (Optional) Whether to include inactive licenses in the response. Default is `false`.

#### Response
A JSON array of objects, each representing a license. For example:

```json
[
    // License #29
    {
        "id": "29",
        "poolId": "26",
        "courseId": "51030",
        "start": "2024-04-17T15:23:08+00:00",
        "end": "2025-01-01T00:00:00+00:00",
        "active": true,
        "revokable": true,
        "editable": true,
        "student": {
            "id": "16521",
            "name": "Student",
            "email": "student@sqlbi.com"
        }
    },
    ... // Additional licenses
]
```

#### Response Fields
See the `License` object fields in the [Licenses](licenses) section for a description of each field.


### `POST` / v1 / pool / {id} / license
Assign a license from the specified pool to a student. Note that:
- If the target student does not exist in the system, a new student will be created.
- If the target student is already enrolled in the course, the operation will fail.
- If the `endDate` is not specified, the license will expire at the pool expiration date.
- If you do not have enough available licenses, the operation will fail, unless you set `recycle` to `true`. In this case (and only if the pool contains transferable licenses), the oldest assigned license in the pool will be revoked and a new one assigned to the target student.

```bash
curl -X POST "https://www.sqlbi.com/api/licensing/v1/pool/12/license" \
     -H "Authorization: Bearer eyJ0eXA*****" \
     -H "Content-Type: application/json" \
     -d '{"email": "student@sqlbi.com", "endDate": "2024-05-01"}'
```

#### Request Body

- `email`: The email address of the student to assign the license to.
- `name`: (Optional) The name of the student to assign the license to. If not provided and the student is not found in the system, the name will be set to *Student*.
- `endDate`: (Optional) The expiration date of the license in `YYYY-MM-DD` format.
- `recycle`: (Optional) A boolean indicating whether to recycle an existing license if no available licenses are present. Default is `false`.

#### Response
A JSON object representing the assigned license. For example:

```json
{
    "id": 38, // New license ID
    "poolId": 12,
    "courseId": "37571",
    "start": "2024-04-19T06:36:10+00:00",
    "end": "2024-05-01T00:00:00+00:00",
    "active": true,
    "revokable": true,
    "editable": true,
    "student": {
        "id": 16521,
        "name": "Student",
        "email": "student@sqlbi.com"
    }
}
```

#### Response Fields
See the `License` object fields in the [Licenses](licenses) section for a description of each field.