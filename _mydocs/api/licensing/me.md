---
layout:     page
title:      Me
published:  true
order:      /0
---
The `Me` object contains information about the license manager, including the number of available license pools, the total number of licenses, and the breakdown of transferable vs. untransferable licenses. Additionally, it lists the domains that are authorized for assigning transferable licenses.

## Endpoints

`GET https://www.sqlbi.com/api/licensing/v1/me`

> The endpoint is authenticated using a bearer token. The token must be included in the *Authorization* header of the request. See more in the [Authentication](index#authentication) section.

### `GET` / v1 / me
Retrieve the license manager's details. Here is how to make this request using curl:

```bash
curl -X GET "https://www.sqlbi.com/api/licensing/v1/me" \
     -H "Authorization: Bearer eyJ0eXA*****"
```

#### Response
Upon a successful request, the API will return a JSON object containing the details about the license manager. Below is an example of a JSON response:

```json
// License Manager #99999
{
    "id": 99999,
    "name": "SQLBI",
    "email": "info@sqlbi.com",
    "pools": 13,
    "licenses": 28,
    "untransferableLicenses": 24,
    "transferableLicenses": 4,
    "allowedDomainsForTransferableLicenses": [
        "sqlbi.com"
    ]
}
```

#### Response Fields

- `id`: The unique identifier of the license manager.
- `name`: The name of the organization or individual managing the licenses.
- `email`: The email address of the license manager.
- `pools`: Number of license pools owned by the license manager.
- `licenses`: The total number of licenses purchased.
- `untransferableLicenses`: The number of untransferable licenses.
- `transferableLicenses`: The number of transferable licenses.
- `allowedDomainsForTransferableLicenses`: A list of domains allowed for assigning transferable licenses. 
> While untransferable licenses can be assigned to any email address, transferable licenses can only be assigned to email addresses with domains listed here.