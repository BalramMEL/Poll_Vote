# Polling App

A simple polling application that allows users to create polls, vote on options, and view real-time results.

## Features

- Create new polls with multiple options.
- Vote on available polls.
- View poll results with percentage breakdown.
- Search polls by question.
- Real-time poll updates.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/polling-app.git

2. Navigate to the project directory:
    ```sh
    cd polling-app

3. Install dependencies:
    ```sh
    npm install

4. Start the development server:
    ```sh
    npm run dev


# API Endpoints
## Polls

### Get all polls,
    GET /api/polls

### Create a Poll
    POST /api/polls


### Vote on a poll  
    POST /api/polls/{pollId}/vote

