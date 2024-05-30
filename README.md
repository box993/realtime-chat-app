# realtime-chat-app
 
# ChatApp

This is a README file for a chat application built with React, Node.js, Express, and Socket.IO.

## Setup and Run Instructions

To run the application, follow these steps:

### Terminal 1 (Client)

1. Navigate to the client directory:

```bash
cd client
```

2. Install the client dependencies:

```bash
npm i --legacy-peer-deps
```

3. Start the client:

```bash
npm start
```

### Terminal 2 (Server)

1. Navigate to the server directory:

```bash
cd server
```

2. Install the server dependencies:

```bash
npm i
```

3. Start the server:

```bash
npm start
```

## API Routes

The server runs on `http://localhost:3000/`. Here are the available API routes:

### `/login`

- **Input:** Email and password
- **Output:** JWT token with user ID
- **Description:** Checks if the user exists and logs them in.

### `/register`

- **Input:** Email and password
- **Output:** JWT token with user ID
- **Description:** Checks if the user already exists, and if not, registers a new user.

### Middleware for Other API Routes

All other API routes require authentication using the `isAuthenticated` middleware, which verifies the JWT token and passes the user ID as `req.userId`.

### `/logout`

- **Description:** Updates the user's status in the database to "away".

### `/getUser`

- **Output:** User's email, status, and user ID
- **Description:** Returns user details for the front page.

### `/getChats`

- **Output:** User's previous chats
- **Description:** Retrieves the user's previous chat history.

### `/getChatMessages`

- **Input:** Chat ID
- **Output:** 10 chat messages
- **Description:** Returns the latest 10 chat messages for the specified chat.

### `/handleStatus`

- **Description:** Updates the user's status in the database on click.

### `/handleSearch`

- **Input:** Search term
- **Description:** Searches for a user and adds them to the chat list by creating a new chat (Note: This route is currently buggy and may require clicking on the new chat a few times or reloading the server to send messages correctly).

### `/getMoreMessages`

- **Input:** Chat ID and the number of messages already fetched
- **Output:** 10 older messages
- **Description:** Returns 10 older messages for the specified chat.

### `/getAiResponse`

- **Input:** Other user's message
- **Output:** AI response from Gemini's API
- **Description:** Generates an AI response to the given prompt using Gemini's API.

## Environment

The application works well on a Windows 10 system. Other environments have not been tested.
