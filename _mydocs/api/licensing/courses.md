---
layout:     page
title:      Courses
published:  true
order:      /1
---
The `Course` object contains information about the courses to which the license manager has access. This includes the total number of licenses, the number of licenses assigned, and the remaining licenses available for assignment. Additionally, it lists the license pools associated with each course, including the start and end dates of the pool, the number of licenses in the pool, and the number of licenses that have been assigned.

## Endpoints

`GET https://www.sqlbi.com/api/licensing/v1/courses`

`GET https://www.sqlbi.com/api/licensing/v1/course/{id}`

> Each endpoint is authenticated using a bearer token. The token must be included in the *Authorization* header of the request. See more in the [Authentication](index#authentication) section.

### `GET` / v1 / courses
Retrieve a list of all courses you have access to. Here is how to make this request using curl:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/courses" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
A successful request will return a JSON array of courses. See the `Course` object response below for more details.

#### Response Fields
See the `Course` object fields below for a description of each field.

### `GET` / v1 / course / {id}
Retrieve detailed information about a specific course by providing the course ID:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/course/37571" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
A JSON object containing detailed information about the specific course, including its license pools.

```json
// Course #37571
{
    "id": "37571",
    "title": "Mastering DAX Video Course",
    "licenses": 10,
    "assignedLicenses": 4,
    "availableLicenses": 6,
    "pools": [
        {
            "id": 21,
            "start": "2022-11-13T19:46:06+00:00",
            "end": "2025-11-13T00:00:00+00:00",
            "transferable": false,
            "licenses": 1,
            "assignedLicenses": 1,
            "availableLicenses": 0
        }
    ]
}
```

#### Response Fields
Each `Course` object contains the following fields:

- `id`: The unique identifier for the course.
- `title`: The name of the course.
- `licenses`: The total number of licenses purchased for the course.
- `assignedLicenses`: The number of licenses that have already been assigned to students.
- `availableLicenses`: The number of licenses that are currently unassigned and available for use.
- `pools`: An array of license pools associated with the course. Each pool object includes:
    - `id`: The unique identifier for the license pool.
    - `start`: The start date and time for the license pool, formatted as an ISO 8601 date string.
    - `end`: The expiration date and time of the license pool, also in ISO 8601 format.
    - `transferable`: A boolean indicating whether the licenses in this pool are transferable (true) or untransferable (false). [See the difference](https://www.sqlbi.com/transferable-video-course-licenses/). 
    - `licenses`: The total number of licenses in the pool.
    - `assignedLicenses`: The number of licenses from this pool that have been assigned.
    - `availableLicenses`: The number of licenses from this pool that are currently available to be assigned.