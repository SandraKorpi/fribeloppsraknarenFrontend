# Frontend Application

This is the frontend application for the **Fribeloppsräknaren(CSNfribeloppApp)** project, built using **JavaScript**, **React**, and **Bootstrap**. The frontend communicates with the backend to provide a smooth user experience for managing and displaying CSN-related data.

## Features

- **React-based UI**: Interactive and dynamic interface to manage and view CSN/worked hours data.
- **Bootstrap**: Responsive design that adapts to various screen sizes.
- **User Authentication**: Allows users to log in and access their personal data.
- **Integration with Backend**: Communicates with the backend to perform CRUD operations on income data and other relevant information.

## Getting Started

### Prerequisites

To run this frontend app, you need to have the **backend API** up and running. Follow these steps to set up and run both the frontend and backend.

### Backend Setup

1. Clone or download the **backend repository** from https://github.com/SandraKorpi/fribeloppsraknarenBackend
2. Follow the instructions in the **backend README** to set up the backend, including configuring the database, dependencies, and running the Spring Boot application.

### Frontend Setup

1. Clone or download this **frontend repository**.
2. Open a terminal/command prompt in the project directory.
3. Install the necessary dependencies:

   ```bash
   npm install
After the installation is complete, run the frontend application:

npm start
The app will be available at http://localhost:3000 by default.

**Backend Integration**
Make sure that the backend API is running, as the frontend communicates with it to fetch and update data. The frontend will make HTTP requests to the backend for user authentication and data management.


**License**
This project is proprietary. You are not allowed to modify, distribute, or copy the code without permission. All rights are reserved by the original author, Sandra Korpi.
