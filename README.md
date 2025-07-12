# charity

# Charity Association Management System

## Project Overview

This project is a web-based management system for a charity association, designed to streamline the process of managing beneficiaries, families, and assistance programs. It provides a user-friendly interface for adding, editing, and viewing information related to individuals, their family structures, and the assistance they receive.

## Features

- **Person Management**: Add, view, edit, and delete individual beneficiary records, including personal details, family relationships, and status (e.g., widow, orphan).
- **Family Management**: Organize individuals into families, allowing for the creation of new families or the association of individuals with existing families. This includes managing family-specific information and members.
- **Assistance Management**: Record and track various forms of assistance provided to individuals or families.

## Project Setup

To set up the project locally, follow these steps:

1.  **Clone the repository** (if applicable):

    ```bash
    git clone <repository_url>
    cd charity
    ```

2.  **Install Dependencies**:

    Navigate to the project root directory and install the necessary Node.js packages:

    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Compiles and hot-reloads for development. This will start a local development server, typically accessible at `http://localhost:8080/`.

### `npm run build`

Compiles and minifies the project for production. This command generates the static files in the `dist/` directory, ready for deployment.

## API Endpoints (Conceptual)

This application interacts with a backend API to manage data. While the backend implementation details are separate, the application is designed to consume the following conceptual API endpoints:

- **Person Endpoints**:

  - `GET /api/persons`: Retrieve a list of all persons.
  - `GET /api/persons/{id}`: Retrieve details of a specific person.
  - `POST /api/persons`: Add a new person.
  - `PUT /api/persons/{id}`: Update an existing person's details.
  - `DELETE /api/persons/{id}`: Delete a person record.

- **Family Endpoints**:

  - `GET /api/families`: Retrieve a list of all families.
  - `GET /api/families/{id}`: Retrieve details of a specific family, including its members.
  - `POST /api/families`: Add a new family.
  - `PUT /api/families/{id}`: Update an existing family's details.
  - `DELETE /api/families/{id}`: Delete a family record.

- **Assistance Endpoints**:
  - `GET /api/assistance`: Retrieve a list of all assistance records.
  - `GET /api/assistance/{id}`: Retrieve details of a specific assistance record.
  - `POST /api/assistance`: Add a new assistance record.
  - `PUT /api/assistance/{id}`: Update an existing assistance record.
  - `DELETE /api/assistance/{id}`: Delete an assistance record.

## Configuration

For more detailed configuration options, refer to the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
