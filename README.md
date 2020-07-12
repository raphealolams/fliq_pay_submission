# Getting Started

# Raphael Olamide Ajilore

A Customer support ticketing system.
The system allows customers to be able to place support requests and support agents to process the request.

---

# Table of Contents

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Running The App](#running-the-app)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Test Cases](#test-cases)
- [API Endpoint](#api-endpoint)

  - [User](#user)

    - [User Registration](#user-registration)
    - [User Login](#user-login)
    - [User Profile](#user-profile)
    - [Get Users](#get-users)
    - [Delete User](#delete-user)

  - [Ticket](#ticket)

    - [Get Tickets](#get-tickets)
    - [Create Ticket](#create-ticket)
    - [Get User Tickets](#get-user-tickets)
    - [Get My Tickets](#get-my-tickets)
    - [Close A Ticket](#close-a-ticket)

  - [Comment](#comment)
    - [Create Comment](#create-comment)

- [Author](#author)
- [What I Do](#what-i-do)

# Prerequisites

you need to have the following installed on your machine

```
    node v11.3.0 or >
    mongodb
```

# Installing

Clone the Repository

```
    git clone https://gitlab.com/korapay/careteam-raphael-olamide.git
```

Install Dependency

```
    npm install
```

# Running The App

## Development Mode

```
    npm run dev
```

## Production Mode

```
    npm start
```

## Test Cases

```
    npm test
```

# API Endpoint

## User

- _User related operation_

### User Registration

- _Handler for user registration_

  **URL** : `/api/v1/users/register`

  **Method** : `POST`

  **Body**:

  ```json
  {
    "firstName": "Raphael",
    "lastName": "Ajilore",
    "email": "raphealolams@yahoo.com",
    "password": "wemove",
    "confirmPassword": "wemove"
  }
  ```

  **Success Responses**

  **Description** : `Once registration is successful the new will be logged into the system. the response entails the user details and authorization token`

  ```json
  {
    "error": false,
    "code": 201,
    "message": "user successfully created",
    "data": {
      "role": "user",
      "createdAt": "2020-07-06T20:34:39.779Z",
      "_id": "5f038b1cf5260e5613bed73f",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "email": "raphealolams@gmail.com",
      "__v": 0,
      "bearerToken": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqVm1NRE00WWpGalpqVXlOakJsTlRZeE0ySmxaRGN6WmlJc0ltVnRZV2xzSWpvaWNtRndhR1ZoYkc5c1lXMXpRR2R0WVdsc0xtTnZiU0lzSW5KdmJHVWlPaUoxYzJWeUluMHNJbWxoZENJNk1UVTVOREEyTnprMU9Td2laWGh3SWpveE5UazBNVFUwTXpVNWZRLll0QzdqMlNBLVgtMTJCVUFMZlVEWGZUcEFEZEIyNFF5dWFrcE1DZ2JDSzg=",
      "expiresIn": "24h"
    }
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "Missing/Empty request body",
      "data": {
          "errors": {

          }
      }
  }

  OR

  {
      "error": false,
      "code": 422,
      "message": "The email already exists.",
      "data": {

      }
  }
  ```

### User Login

- _login handles authentication, essentially the user is required to validate their identity by providing it's email and password_

  **URL** : `/api/v1/users/login`

  **Method** : `POST`

  **Body** :

  ```json
  {
    "email": "raphealolams@yahoo.com",
    "password": "wemove"
  }
  ```

  **Success Response**

  **Description** : `Once authentication is successful the user will be logged into the system. the response entails the user details and authorization token`

  ```json
  {
    "error": false,
    "code": 200,
    "message": "login successful",
    "data": {
      "role": "user",
      "createdAt": "2020-07-06T20:34:39.779Z",
      "_id": "5f038b1cf5260e5613bed73f",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "email": "raphealolams@gmail.com",
      "__v": 0,
      "bearerToken": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqVm1NRE00WWpGalpqVXlOakJsTlRZeE0ySmxaRGN6WmlJc0ltVnRZV2xzSWpvaWNtRndhR1ZoYkc5c1lXMXpRR2R0WVdsc0xtTnZiU0lzSW5KdmJHVWlPaUoxYzJWeUluMHNJbWxoZENJNk1UVTVOREEyTnprMU9Td2laWGh3SWpveE5UazBNVFUwTXpVNWZRLll0QzdqMlNBLVgtMTJCVUFMZlVEWGZUcEFEZEIyNFF5dWFrcE1DZ2JDSzg=",
      "expiresIn": "24h"
    }
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "bad request",
      "data": {
          "message": "Missing/Empty request body",
          "errors": {

          }
      }
  }

  OR

  {
      "error": true,
      "code": 422,
      "message": "failure",
      "data": {
          "message": "invalid email or password"
      }
  }
  ```

### User Profile

- _Returns User Details_

  **URL** : `/api/v1/users/me`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : `the response entails the user details`

  ```json
  {
    "error": false,
    "code": 200,
    "message": "user fetched",
    "data": {
      "role": "user",
      "createdAt": "2020-07-06T20:34:39.779Z",
      "_id": "5f038b1cf5260e5613bed73f",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "email": "raphealolams@gmail.com"
    }
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
    "error": true,
    "code": 401,
    "message": "Unauthorized",
    "data": {}
  }
  ```

### Get Users

- _returns all user's saved on the system_

  **URL** : `/api/v1/users`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 200,
    "message": "users fetched",
    "data": [
      {
        "role": "user",
        "active": true,
        "_id": "5f038b1cf5260e5613bed73f",
        "firstName": "Raphael",
        "lastName": "Ajilore",
        "email": "raphealolams@gmail.com"
      },
      {
        "role": "user",
        "active": true,
        "_id": "5f03981a29984b5e4c748ab1",
        "firstName": "Raphael",
        "lastName": "Ajilore",
        "email": "raphealolams@yahoo.com"
      }
    ]
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
    "error": true,
    "code": 401,
    "message": "Unauthorized",
    "data": {}
  }
  ```

### Delete User

- _delete a user_

  **URL** : `/api/v1/users/delete`

  **Method** : `DELETE`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Body** :

  ```json
  {
    "email": "raphealolams@yahoo.com"
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 200,
    "message": "user successfully deleted",
    "data": {}
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
    "error": true,
    "code": 400,
    "message": "Missing/Empty request body",
    "data": {
      "errors": {}
    }
  }
  ```

## Ticket

- _Everything about Ticket_

### Get Tickets

- _returns all tickets saved on the system_

  **URL** : `/api/v1/tickets/getTickets`

  **URL Query** : `status=[string] 'all' || 'closed' || 'open'`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 200,
    "message": "tickets fetched",
    "data": [
      {
        "status": "open",
        "_id": "5f08487e9a4f3223a54057d1",
        "title": "Super Human",
        "description": "Human with all the abilities",
        "tag": "tag-787704",
        "userId": {
          "firstName": "Raphael",
          "lastName": "Ajilore"
        },
        "comments": [
          {
            "senderType": "admin",
            "_id": "5f0863f2bc3d4d2fa95dfa2d",
            "comment": "shit happens",
            "userId": {
              "firstName": "Raphael",
              "lastName": "Ajilore"
            }
          },
          {
            "senderType": "admin",
            "_id": "5f08640533c4f32fca8ed3b2",
            "comment": "shit happens",
            "userId": {
              "firstName": "Raphael",
              "lastName": "Ajilore"
            }
          }
        ],
        "__v": 0
      },
      {
        "status": "open",
        "_id": "5f085edfec1dac2850f29ad7",
        "title": "Super Human",
        "description": "Human with all the abilities",
        "tag": "tag-444488",
        "userId": {
          "firstName": "Raphael",
          "lastName": "Ajilore"
        },
        "comments": [],
        "__v": 0
      }
    ]
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "Missing/Empty query string",
      "data": {
          "errors": {
              "status": "is required"
          }
      }
  }

  OR

  {
      "error": false,
      "code": 422,
      "message": "error occurred",
      "data": {
          "errors": {

          }
      }
  }
  ```

### Create Ticket

- _Allows User(Customer to create Ticket)_

  **URL** : `/api/v1/tickets/create`

  **Method** : `POST`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Body** :

  ```json
  {
    "title": "is required",
    "description": "is required"
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 201,
    "message": "ticket successfully created",
    "data": {
      "id": "7668c64383f146628388d62c0bf4f9d",
      "status": "open",
      "title": "is required",
      "description": "is required",
      "tag": "tag-796052",
      "userId": "8671e3b1-a377-48fd-a9bd-c5854566138d",
      "updatedAt": "2020-03-19T10:50:43.457Z",
      "createdAt": "2020-03-19T10:50:43.457Z"
    }
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "Missing/Empty Request body",
      "data": {

          "errors": {

          }
      }
  }

  OR

  {
      "error": true,
      "code": 422,
      "message": "error occurred",
      "data": {

          "errors": {}
      }
  }
  ```

### Get User Tickets

_used by admin or support agent_

- _This endpoints returns tickets for a user_

  **URL** : `/api/v1/tickets/user`

  **URL Query** : `userId=[string]`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 200,
    "message": "tickets fetch",
    "data": [
      {
        "status": "open",
        "_id": "5f086fb9523e13364115231b",
        "title": "Super Human",
        "description": "Human with all the abilities",
        "tag": "tag-608057",
        "userId": {
          "_id": "5f038b1cf5260e5613bed73f",
          "firstName": "Raphael",
          "lastName": "Ajilore"
        },
        "comments": [],
        "__v": 0
      },
      {
        "status": "open",
        "_id": "5f086fc9523e13364115231c",
        "title": "Super Human Testing",
        "description": "Human with all the abilities",
        "tag": "tag-700772",
        "userId": {
          "_id": "5f038b1cf5260e5613bed73f",
          "firstName": "Raphael",
          "lastName": "Ajilore"
        },
        "comments": [],
        "__v": 0
      },
      {
        "status": "open",
        "_id": "5f086fde523e13364115231d",
        "title": "I can't access my deezer app",
        "description": "Human with all the abilities",
        "tag": "tag-974301",
        "userId": {
          "_id": "5f038b1cf5260e5613bed73f",
          "firstName": "Raphael",
          "lastName": "Ajilore"
        },
        "comments": [],
        "__v": 0
      }
    ]
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "Missing/Empty Query Parameter",
      "data": {

          "errors": {

          }
      }
  }

  OR

  {
      "error": false,
      "code": 422,
      "message": "error occurred",
      "data": {

          "errors": {

          }
      }
  }
  ```

### Get My Tickets

- _This endpoints returns tickets for a user (customer) if and only if the customer is logged in_

  **URL** : `/api/v1/tickets/me`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 200,
    "message": "tickets fetch",
    "data": [
      {
        "id": "6406c34271b84ad3a011",
        "title": "is required",
        "description": "is required",
        "status": "closed",
        "userId": "bf17409962400459dc1",
        "tag": "tag-572958",
        "createdAt": "2020-03-19T13:34:02.000Z",
        "updatedAt": "2020-03-19T16:26:07.000Z"
      }
    ]
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
    "error": true,
    "code": 401,
    "message": "Unauthorized",
    "response": {}
  }
  ```

### Get Ticket Report

- _Returns List of closed tickets in the last 30 days_

  **URL** : `/api/v1/tickets/report`

  **Method** : `GET`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Success Response**

  **Description** : `returns a pdf file`

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
    "error": true,
    "code": 422,
    "message": "error occurred",
    "data": {
      "errors": {}
    }
  }
  ```

### Close A Ticket

- _close a ticket_

  **URL** : `/api/v1/tickets/closeATicket`

  **Method** : `PUT`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Body**:

  ```json
  {
    "ticketId": "6406c342-a0d0-4936-a20c-71b84ad3a011"
  }
  ```

  **Success Response**

  **Description** : `returns a pdf file`

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
      {
      "error": true,
      "code": 400,
      "message": "Missing/Empty Query String",
      "data": {

          "errors": {
              "ticketId": "is required"
          }
      }
  }

  OR

  {
      "error": true,
      "code": 422,
      "message": "error occurred",
      "data": {

          "errors": {

          }
      }
  }
  ```

## Comment

- _Everything about Comment_

### Create Comment

- _This endpoint creates comments_

  **URL** : `/api/v1/comments/create`

  **Method** : `POST`

  **Auth Required** : YES

  **Header**:

  ```json
  {
    "Authorization": "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmtZWFJoSWpwN0luVnpaWEpKWkNJNklqZzJOekZsTTJJeExXRXpOemN0TkRobVpDMWhPV0prTFdNMU9EVTBOVFkyTVRNNFpDSXNJbVZ0WVdsc0lqb2ljbUZ3YUdWaGJHOXNZVzF6UUdkdFlXbHNMbU52YlNJc0luSnZiR1VpT2lKaFpHMXBiaUo5TENKcFlYUWlPakUxT0RRM01UVTBOakFzSW1WNGNDSTZNVFU0TkRnd01UZzJNSDAubzlnbEE0TDNJYWl5dlNQUFFEdjlrWE0wTFZMcWs0cEQwUEg1X0wxSjBRdw=="
  }
  ```

  **Body** :

  ```json
  {
      "ticketId": "7668c643-83f1-4662-8388-1d62c0bf4f9d",
  "
  }
  ```

  **Success Response**

  **Description** : ``

  ```json
  {
    "error": false,
    "code": 201,
    "message": "comment successfully created",
    "data": {
      "id": "7668c643-83f1-4662-8388-1d62c0bf4f9d",
      "status": "open",
      "title": "is required",
      "description": "is required",
      "tag": "tag-796052",
      "userId": "8671e3b1-a377-48fd-a9bd-c5854566138d",
      "updatedAt": "2020-03-19T10:50:43.457Z",
      "createdAt": "2020-03-19T10:50:43.457Z"
    }
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  ```json
  {
      "error": true,
      "code": 400,
      "message": "Missing/Empty Request body",
      "data": {
          "errors": {
              "ticketId": "is required",
          }
      }
  }

  OR

  {
      "error": true,
      "code": 422,
      "message": "error occurred",
      "data": {
      }
  }
  ```

# Author

- **Ajilore Raphael Olamide ()** - _Other Works_ - [github](https://github.com/raphealolams)

# What I Do

- eat
- code
- sleep
- repeat
