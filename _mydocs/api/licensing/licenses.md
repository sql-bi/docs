---
layout:     page
title:      Licenses
published:  true
order:      /3
---
The `License` object represents a course license assigned to a student. It includes the student's name, email address, the course title, the license start and end dates, and the license status.

> While you can revoke a license by providing its id and using the `v1/license` endpoint, to assign a new license to a student, you must use to the `/v1/pool/` endpoint. See more in the [Pools](pools) section.

## Endpoints

`GET https://www.sqlbi.com/api/licensing/v1/licenses`

`GET https://www.sqlbi.com/api/licensing/v1/license/{id}`

`PATCH https://www.sqlbi.com/api/licensing/v1/license/{id}`

`DELETE https://www.sqlbi.com/api/licensing/v1/license/{id}`

> Each endpoint is authenticated using a bearer token. The token must be included in the *Authorization* header of the request. See more in the [Authentication](index#authentication) section.

### `GET` / v1 / licenses  

Retrieve a list of all assigned licenses with details about the associated student and course. Supports pagination and filtering inactive licenses.

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/licenses?pageSize=50" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Query Parameters

- `page`: (Optional) The page number to retrieve. Default is `1`.
- `pageSize`: (Optional) The number of licenses to retrieve per page. Default is `10`.
- `includeInactive`: (Optional) Whether to include inactive licenses in the response. Default is `false`.

#### Response
A JSON array of objects, each representing a license. See the `License` object response below for more details.

#### Response Fields
See the `License` object fields below for a description of each field.

### `GET` / v1 / license / {id}

Retrieve detailed information about a specific license by providing the license ID:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/license/29" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
A JSON object detailing the specific license, including the student and course information.

```json
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
}
```

#### Response Fields

- `id`: The unique identifier for the license.
- `poolId`: The identifier of the pool from which the license is allocated.
- `courseId`: The identifier of the course associated with the license.
- `start`: The start date and time of the license validity period in ISO 8601 format.
- `end`: The end date and time of the license validity period in ISO 8601 format.
- `revokable`: A boolean indicating whether the license can be revoked (true) or not (false).
- `editable`: A boolean indicating whether the license end date can be edited (true) or not (false).
- `student`: An object containing:
    - `id`: The unique identifier for the student.
    - `name`: The name of the student.
    - `email`: The email address of the student.


### `PATCH` / v1 / license / {id}
Update the expiration date of a license. Note that:
- The update is allowed only if the parent license pool is transferable.
- The update is allowed only if the license is not expired. 
- If you put a date in the past, the license will be immediately expired and cannot be updated anymore. 
- If you put a date in the future, the license cannot be extended further than the pool expiration date.

```bash
curl -X PATCH "https://www.sqlbi.com/api/licensing/v1/license/29" \
     -H "Authorization: Bearer eyJ0eXA*****" \
     -H "Content-Type: application/json" \
     -d '{"endDate": "2027-04-18"}'
```

#### Request Body
- `endDate`: The new expiration date of the license in YYYY-MM-DD format.

#### Response
A JSON object representing the updated license.

### `DELETE` / v1 / license / {id}
Revoke a license. The license will be immediately expired, and the student will lose access to the course.

```bash
curl -X DELETE "https://www.sqlbi.com/api/licensing/v1/license/26" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
HTTP status code `200` if the operation is successful.