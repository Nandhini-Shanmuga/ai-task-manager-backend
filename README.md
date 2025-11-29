## Task Management System – Backend

## Overview

The Task Management System backend provides secure APIs for managing user tasks with status tracking such as Todo, In-Progress, and Completed. The system supports user authentication, dashboard summaries, and complete task lifecycle management. This backend is designed to integrate seamlessly with the Angular-based Task Management frontend.

## Key Features:

User Authentication: Secure login & registration using JWT.

Task Management: Create, update, delete, and fetch tasks.

Status Tracking: Supports Todo, In-Progress, and Completed statuses for tasks.

Dashboard Summary: Provides aggregated counts for Todo, In-Progress, Completed, and Total tasks.

Secure REST API: All user-level data is protected with authentication middleware.


Table of Contents

1.Prerequisites

2.Installation

3.Configuration

4.Usage

## Prerequisites

Before you begin, ensure the following are installed:

Node.js version 24.11.1


## Installation

Clone the repository:

1.git clone https://github.com/Nandhini-Shanmuga/ai-task-manager-backend.git


2.Navigate into the project:

cd ai-task-manager-backend


3.Install dependencies:

npm install

## Configuration
Before you start, copy the example environment file to create your own configuration file. Run the following commands in the project root:

cp .env-sample .env


## Usage
To start the project after the Babel transpilation, use the following command:

npm start
The application will start, and you can access it by navigating to http://localhost:your_port in your browser, with your_port being the port specified in your environment variables.


