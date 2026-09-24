# Backend API — Video Platform

A production-oriented backend API built with Node.js, Express.js, and MongoDB. The project provides authentication, user management, video management, comments, likes, playlists, file uploads, and other RESTful API functionality.

The project follows a modular backend architecture with controllers, models, routes, middleware, utilities, and database configuration.

## Features

### Authentication and User Management

* User registration
* User login
* User logout
* JWT-based authentication
* Access token and refresh token handling
* Protected routes
* User profile management
* Password management
* Authentication middleware

### Video Management

* Upload videos
* Upload video thumbnails
* Get video details
* Update video information
* Delete videos
* Publish and unpublish videos
* Track video views
* Retrieve videos
* Owner-based video authorization

### Comments

* Add comments to videos
* Get video comments
* Update comments
* Delete comments
* Owner-based comment authorization
* Pagination for comments

### Likes

* Like videos
* Unlike videos
* Retrieve liked videos
* Manage user-specific likes

### Playlists

* Create playlists
* Get user playlists
* Get playlist details
* Update playlists
* Delete playlists
* Add videos to playlists
* Remove videos from playlists

### File Uploads

* Video file uploads
* Thumbnail uploads
* Image uploads
* Multer-based file handling
* Cloudinary integration for media storage

### API Features

* RESTful API architecture
* Request validation
* Custom error handling
* Async request handling
* Authentication middleware
* ObjectId validation
* Pagination
* MongoDB population
* Structured API responses

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JavaScript
* JWT

### Authentication and Security

* JSON Web Tokens
* Access Tokens
* Refresh Tokens
* HTTP Cookies
* Protected Routes
* Authentication Middleware

### File and Media Management

* Multer
* Cloudinary

### Development and Testing

* Postman
* Git
* GitHub
* VS Code

---

## Project Architecture

```text
Backend
│
├── src/
│   │
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   └── playlist.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   └── playlist.model.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   └── playlist.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── db/
│   │   └── database.js
│   │
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   │
│   ├── app.js
│   └── server.js
│
├── public/
│
├── package.json
└── README.md
```

---

## Backend Architecture

```text
                    Client
                      |
                      v
                HTTP Request
                      |
                      v
                Express Server
                      |
                      v
                   Routes
                      |
                      v
                 Middleware
                      |
          +-----------+-----------+
          |                       |
          v                       v
   Authentication           File Upload
      Middleware               Multer
          |                       |
          +-----------+-----------+
                      |
                      v
                 Controllers
                      |
                      v
                    Models
                      |
                      v
                  Mongoose
                      |
                      v
                   MongoDB
```

---

## Authentication Flow

The project uses JWT-based authentication with access and refresh tokens.

```text
User
 |
 v
Register / Login
 |
 v
Validate Credentials
 |
 v
Generate JWT Tokens
 |
 +--------------------+
 |                    |
 v                    v
Access Token       Refresh Token
 |                    |
 v                    v
API Requests       Token Renewal
 |
 v
Authentication Middleware
 |
 v
Protected Controller
```

Authentication middleware verifies the user's JWT before allowing access to protected routes.

---

## Video Upload Flow

```text
Client
  |
  v
Video + Thumbnail
  |
  v
Multer
  |
  v
File Validation
  |
  v
Cloudinary
  |
  +-------------------+
  |                   |
  v                   v
Video URL        Thumbnail URL
  |                   |
  +---------+---------+
            |
            v
        MongoDB
            |
            v
       Video Document
```

---

## Database Models

The application uses MongoDB with Mongoose for database management.

### User

Stores user information and authentication-related data.

```text
User
 |
 +-- username
 +-- email
 +-- password
 +-- avatar
 +-- coverImage
 +-- watchHistory
 +-- refreshToken
```

### Video

Stores uploaded video information.

```text
Video
 |
 +-- title
 +-- videoFile
 +-- thumbnail
 +-- description
 +-- duration
 +-- views
 +-- isPublished
 +-- owner
```

### Comment

Stores comments associated with videos and users.

```text
Comment
 |
 +-- content
 +-- video
 +-- owner
```

### Like

Stores user likes associated with videos.

```text
Like
 |
 +-- video
 +-- likedBy
```

### Playlist

Stores user-created playlists and associated videos.

```text
Playlist
 |
 +-- name
 +-- description
 +-- videos
 +-- owner
```

---

## API Modules

### User

```text
/api/v1/users
```

Provides functionality for:

* Registration
* Login
* Logout
* Profile management
* Password management
* Token management

### Videos

```text
/api/v1/videos
```

Provides functionality for:

* Uploading videos
* Retrieving videos
* Updating videos
* Deleting videos
* Publishing videos
* Managing video information

### Comments

```text
/api/v1/comments
```

Provides functionality for:

* Adding comments
* Retrieving comments
* Updating comments
* Deleting comments
* Paginating comments

### Likes

```text
/api/v1/likes
```

Provides functionality for:

* Liking videos
* Removing likes
* Retrieving liked videos

### Playlists

```text
/api/v1/playlists
```

Provides functionality for:

* Creating playlists
* Retrieving playlists
* Updating playlists
* Deleting playlists
* Managing playlist videos

---

## Error Handling

The backend uses centralized error-handling utilities to provide consistent API responses.

The project includes:

* Custom API error class
* Standard API response structure
* Async request handler
* Request validation
* MongoDB ObjectId validation
* HTTP status codes
* Descriptive error messages

Example response structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Request completed successfully",
  "success": true
}
```

---

## Pagination

Pagination is implemented for resources such as comments and other collection-based endpoints.

```text
Page
 |
 v
Limit
 |
 v
Calculate Skip
 |
 v
MongoDB Query
 |
 v
Paginated Response
```

This helps prevent unnecessarily large responses when retrieving collections containing many documents.

---

## Cloudinary Integration

Cloudinary is used for storing uploaded media files.

The backend handles:

* Video uploads
* Thumbnail uploads
* Image uploads
* Cloudinary URLs
* Media deletion
* Public ID management

---

## API Testing

The APIs are tested using Postman.

Testing includes:

* Authentication requests
* Protected routes
* Video CRUD operations
* Comment operations
* Like operations
* Playlist operations
* File uploads
* Error cases
* Authorization checks

---

## Development Workflow

```text
Client Request
      |
      v
    Route
      |
      v
  Middleware
      |
      v
  Controller
      |
      v
    Model
      |
      v
   MongoDB
      |
      v
 API Response
```

---

## What I Learned

Through this project, I gained practical experience in:

* Building RESTful APIs with Express.js
* Designing scalable backend architecture
* MongoDB database design
* Mongoose schemas and relationships
* JWT authentication
* Access and refresh token handling
* Middleware development
* CRUD operations
* File upload handling
* Cloudinary integration
* API error handling
* Pagination
* MongoDB population
* Authorization and ownership checks
* API testing with Postman
* Git and GitHub workflow

---

## Future Improvements

* Video search functionality
* Advanced video filtering
* Subscription system
* Watch history API
* Tweet and social interaction features
* Notification system
* API rate limiting
* Improved request validation
* Automated API testing
* API documentation using Swagger
* Production deployment

---

## Developer

**Nitish Yadav**

B.Tech CSE | Full-Stack Developer

GitHub: https://github.com/nitish-x18

LinkedIn: https://www.linkedin.com/in/nitish-yadav-x18/
