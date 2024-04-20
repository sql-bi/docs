---
layout:     page
title:      Licensing API
menu_title: Licensing
published:  true
order:      /
---
This API allows SQLBI license managers to manage course licenses, including querying, assigning, and updating licenses across a variety of courses offered by SQLBI. It also enables the management of students and interrogation of their course progress.

To become a license manager, you must have purchased an SQLBI video course with a transferable license (or with an *unassigned* untransferable license). If you are interested in learning more about our licensing options, please visit the [Transferable vs. Untransferable Licenses](https://www.sqlbi.com/transferable-video-course-licenses/) page.

> Note the API is not required to manage your licenses since [we offer a web interface to manage them](https://www.sqlbi.com/license-manager-guide/). The API is intended for advanced users who want to automate the management of licenses or to integrate our licensing system with their own systems.

## Base URL

The base URL for the SQLBI Licensing API is:

```
https://www.sqlbi.com/api/licensing
```

## Authentication

To access the Licensing API, you need to authenticate using a bearer token. This token must be included as a header in each of your requests. Here's how you can generate and use your API token:

- Generate an API token in the [API section of the License Manager](https://www.sqlbi.com/license-manager-guide/#tokens).
- Use this token by including it in the *Authorization* header as bearer token.  For example:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/me" \
     -H "Authorization: Bearer {token}"
```

> Note that the API token is a secret key that **should be kept confidential**. Do not share it in public forums or with unauthorized users. If you suspect that your token has been compromised, you can revoke the old one and regenerate it in the License Manager.

## Errors

The API uses standard HTTP status codes to indicate the success or failure of requests. Common responses include:

- `200 OK`: The request was successful.
- `400 Bad Request`: The request was invalid. Details about the error will be included in the response body.
- `401 Unauthorized`: The request did not include a valid API token.
- `403 Forbidden`: The provided API token does not have the necessary permissions for the requested operation.
- `404 Not Found`: The requested resource does not exist.
- `429 Too Many Requests`: You have hit the rate limit for the API.
- `500 Internal Server Error`: An error occurred on the server. Please try again later.

## Pagination

To ensure the performance and reliability of the API, responses that return a list of items are paginated. The **default number of items per page is 10**. You can navigate through the pages using the `page` parameter and customize the page size using the `pageSize` parameter in your request.

Example:  

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/students?page=2&pageSize=20" \
     -H "Authorization: Bearer eyJ0eXA*****"
```
*Returns the second page of 20 students per page.*

## Rate limits

We implement rate limiting to ensure fair usage and stability of the API for all users. When you exceed the rate limit, you will receive a `429 Too Many Requests` response. 

The current limit is set to **25 requests per minute**. 
> Note that this limit may change over time based on usage patterns and server load.

## Namespaces

The Licensing API consists of several namespaces and endpoints that allow you to manage your licenses and students effectively:

- [Me](me): Retrieve details about the license manager, including available licenses and pools.
- [Courses](courses): Access the list of courses you have licenses for.
- [Pools](pools): Manage your license pools.
- [Licenses](licenses): Query and manage licenses assigned to students.
- [Students](students): Get details about students and their course progress.