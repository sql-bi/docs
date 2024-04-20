---
layout:     page
title:      Students
published:  true
order:      /4
---
The `Student` object contains comprehensive details about students, including their registered courses, the status of their licenses, and their progress within each course.

## Endpoints

`GET https://www.sqlbi.com/api/licensing/v1/students`

`GET https://www.sqlbi.com/api/licensing/v1/student`

> Each endpoint is authenticated using a bearer token. The token must be included in the *Authorization* header of the request. See more in the [Authentication](index#authentication) section.


### `GET` / v1 / students
Retrieve a list of all students managed by the license manager. Supports pagination and filtering inactive licenses.

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/students?page=2" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Query Parameters

- `page`: (Optional) The page number to retrieve. Default is `1`.
- `pageSize`: (Optional) The number of licenses to retrieve per page. Default is `10`.
- `includeInactive`: (Optional) Whether to include inactive courses in the response. Default is `false`.


#### Response
A JSON array of student objects, each containing details about their registered courses and licenses. See the `Student` object response below for more details.

### `GET` / v1 / student
Retrieve detailed information about a specific student managed by you by using either their email address or user ID as a query parameter. This allows for flexible student lookup depending on available data.

```bash
# Query by email address
curl -X GET "https://www.sqlbi.com/api/licensing/v1/student?email=student@sqlbi.com" \
     -H "Authorization: Bearer eyJ0eXA*****"


# Query by user ID
curl -X GET "https://www.sqlbi.com/api/licensing/v1/student?id=16521" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Query Parameters
- `email`: (Optional) The email address of the student to query.
- `id`: (Optional) The unique identifier of the student to query.
- `includeInactive`: (Optional) Whether to include inactive courses in the response. Default is `false`.

> At least one between `email` and `id` must be provided.

#### Response
A JSON object detailing the specific student, including comprehensive course and license information.

```json
// Student #16521
{
    "id": 16521,
    "name": "Student",
    "email": "student@sqlbi.com",
    "courses": [
        {
            "id": "718435",
            "title": "SQLBI+",
            "poolId": 33,
            "licenseId": 31,
            "licenseActive": true,
            "licenseRevokable": false,
            "licenseEditable": false,
            "start": "2024-04-18T06:48:42+00:00",
            "end": "2024-10-29T07:16:28+00:00",
            "progress": 50,
            "completed": null
        },
        {
            "id": "65104",
            "title": "Data Modeling for Power BI Video Course",
            "poolId": 37,
            "licenseId": 32,
            "licenseActive": true,
            "licenseRevokable": false,
            "licenseEditable": false,
            "start": "2024-04-10T06:50:09+00:00",
            "end": "2027-04-18T00:00:00+00:00",
            "progress": 100,
            "completed": "2024-04-18T01:07:00+00:00"
        },
        ... // Additional courses
    ]
}
```

#### Response Fields
Each `Student` object contains the following fields:

- `id`: Unique identifier for the student.
- `name`: Name of the student.
- `email`: Email address of the student.
- `courses`: An array of course objects associated with the student, each containing:
    - `id`: The course ID.
    - `title`: The title of the course.
    - `poolId`: Identifier for the license pool from which the license is assigned.
    - `licenseId`: Identifier for the specific license.
    - `licenseActive`: Boolean indicating if the license is currently active.
    - `licenseRevokable`: Boolean indicating if the license can be revoked.
    - `licenseEditable`: Boolean indicating if the license expiration date can be edited.
    - `start`: The start date of the license in ISO 8601 format.
    - `end`: The expiration date of the license in ISO 8601 format.
    - `progress`: Percentage of course completion by the student.
    - `completed`: The completion date of the course in ISO 8601 format, if applicable.
