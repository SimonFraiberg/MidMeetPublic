# MidMeet

MidMeet is a web application that suggests a convenient meeting location for users based on their locations and preferences. The app leverages the Google Places API to provide recommendations for restaurants, activities, and more.

# Final Video
https://www.youtube.com/watch?v=wy3WV5YO_AY

# recommendation example
![recommendation example](https://github.com/user-attachments/assets/9eb65ca5-5eaf-4f5d-b4a5-7454be465c3c)


# Figma Design
https://www.figma.com/design/t9FzLUccClHpoAcWw9knCw/MidMeet?node-id=0-1&t=GZ1vtBsbk72mMI8f-1


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)


## Features

- **User Registration and Authentication**: Secure login and registration with JWT-based authentication.
- **Personalized Meeting Suggestions**: Provides location-based meeting suggestions for users.
- **Real-time Recommendations**: Integrates with Google Places API to fetch the latest restaurant and activity options.
- **Interactive User Interface**: Built with React and TypeScript for a modern and responsive UI.

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **APIs**: Google Places API

## Installation

To get started with MidMeet, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/boogi590/MidMeet.git
    cd midmeet
    ```

2. **Install dependencies for both frontend and backend:**

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
3. **Set up environment variables:**

    Create a `.env` file in the `backend` directory with the following content:

    ```env
    GMAIL_USER='your_gmail_user'
    GMAIL_PASSWORD='your_gmail_password'
    ACCESS_SECRET='your_access_secret'
    REFRESH_SECRET='your_refresh_secret'
    CONNECTION_STRING='your_mongodb_connection_string'
    GOOGLE_SECRET='your_google_secret'
    GOOGLE_SECRET_QR='your_google_secret_qr'
    PORT=your_port_number
    GOOGLE_API='your_google_api_key'
    ```

    Replace each placeholder (`your_*`) with the actual values required for your application.

4. **Run the application:**

    ```bash
    # Run backend server
    cd server
    npm run server

    # Run frontend server
   
    npm run dev
    ```

5. **Open your browser and visit:**

    ```
    http://localhost:5173
    ```

## Usage

- **Register or Login**: Users can create an account or log in using their credentials.
- **Take the Quiz**: Fill out a preferences quiz to personalize your experience.
- **Create or Join Meets**: Users can create new meets or join existing ones and see recommendations for restaurants and activities.
- **Get Suggestions**: Receive suggestions for meeting places based on user locations and preferences.


