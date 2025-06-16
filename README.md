# SHELFSHARE: Virtual Book Sharing Platform

---

## 📚 Project Overview

Shelfshare is an **open-source, full-stack application** designed to revolutionize how individuals interact with books. It creates a virtual book-sharing ecosystem where users can seamlessly access, share, and manage their literary collections from anywhere, at any time, all while maintaining privacy. From registration and login to adding personal books and managing sharing requests, Shelfshare offers a comprehensive and intuitive experience for book enthusiasts.

---

## 👥 Project Contributors:

* Isha Tilwani
* Harshita Padmanabhuni
* Ashish Kumar
* Ghousiya Begum

---

## ✨ Key Features

* ✅ **User Authentication:** Secure user **registration**, **login**, and **logout**.
* ✅ **Book Browse:** Explore and view **all available books** online.
* ✅ **Personal Bookshelf:** Easily **add books** to your personal collection and manage them.
* ✅ **Book Sharing:** Make your books **available for others** to borrow.
* ✅ **Transparency in Library:** **Update available and issued book counts** for clear tracking.
* ✅ **Privacy-Centric:** Users **cannot view other users' bookshelves**, ensuring personal privacy.
* ✅ **Custom User Routes:** Each user gets a **unique route** associated with their User ID.
* ✅ **Access Control:** Restricted library access **without signing in**.
* ✅ **Data Validation:** Prevents new book submissions **without all required information**.
* ✅ **Book Management:** Comprehensive tools to **add, view, and manage** your books.
* ✅ **Anonymous Book Sharing:** Share books **without revealing personal details**.
* ✅ **Advanced Search & Filter:** Efficiently browse books by **genre, author, state, city, or area**.
* ✅ **Borrow Request Management:** Users can **send, accept, or approve** book borrow requests.
* ✅ **AI-Powered Note Summarization:** Automatically generates concise summaries of book notes.
* ✅ **Smart Master Title Generation:** Creates intelligent, unified titles from user-defined book titles.

---

## 🚀 Architecture

Shelfshare is built with a robust full-stack architecture, comprising a powerful Spring Boot backend, a dynamic React.js frontend, and a reliable PostgreSQL database.

### The project consists of three main components:

1.  **Spring Boot Backend (Java):**
    * Serves as the **main API** for managing books and user interactions.
    * Handles **data persistence** to the PostgreSQL database.

2.  **Database (PostgreSQL):**
    * Stores all **`Books` information**.
    * Manages **`Users` data** and their associations.

3.  **Frontend (React.js):**
    * Provides an **enhanced User Experience (UX)** and an **intuitive User Interface (UI)**.

4. **Notes Summarization API (Python Flask):**
    * Provides AI services for summarizing book notes and generating master titles.
    * Utilizes Hugging Face models for natural language processing tasks.

---

## 🛠️ Technologies Used

* **Backend:**
    * Java 17+ (JDK 24 recommended)
    * Spring Boot 3.x
    * Spring Data JPA
    * Gradle (build automation)
* **Notes Summarization API:**
    * Python 3.x
    * Flask
    * Hugging Face Hub (`huggingface_hub`)
    * python-dotenv`
* **Database:**
    * PostgreSQL
* **Deployment (for production/demo - *future consideration*):**
    * Cloud Providers (e.g., AWS, GCP, DigitalOcean)
    * Docker (optional, for containerization)
* **Frontend:**
    * React.js
    * Axios (HTTP client)
    * Tailwind CSS (styling and responsive design)

---

## ⚙️ Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Java 17+ SDK** (e.g., OpenJDK 24)
* **Gradle**
* A running **PostgreSQL database instance**

### 1. Database Setup

1.  Create a new database for the project (e.g., `shelfshare`).
2.  Update your Spring Boot `application.properties` file with your PostgreSQL database connection details. You'll find this file typically in `backend/shelfshare/src/main/resources/`.

    ```properties
    spring.application.name=shelfshare
    server.port=1234
    spring.datasource.url=jdbc:postgresql://localhost:5432/shelfshare
    spring.datasource.username=<your_db_username>
    spring.datasource.password=<your_db_password>
    spring.jpa.show-sql=true
    spring.jpa.hibernate.format_sql=true
    spring.jpa.hibernate.highlight_sql=true
    spring.jpa.hibernate.ddl-auto=update

    logging.level.org.springframework.security=DEBUG
    ```
    *Replace `<your_db_username>` and `<your_db_password>` with your actual PostgreSQL credentials.*

### 2. Spring Boot Backend Setup

1.  Clone the Shelfshare repository to your local machine:

    ```bash
    git clone [https://gitlab.com/pvgharshita/shelfshare.git](https://gitlab.com/pvgharshita/shelfshare.git)
    ```

2.  Navigate into the backend project directory:

    ```bash
    cd shelfshare/backend/shelfshare 
    ```

3.  Build the Spring Boot project using Gradle:

    ```bash
    gradle clean build
    ```

4.  Run the Spring Boot application:

    ```bash
    gradle bootRun
    ```
    The backend API will typically start on `http://localhost:1234`.

### 3. Frontend Setup

1.  Navigate into the frontend project directory from the root of the cloned repository:

    ```bash
    cd ../../frontend/
    ```

2.  Install the necessary Node.js dependencies:

    ```bash
    npm install
    ```

3.  Start the React development server:

    ```bash
    npm run dev
    ```
    The frontend application will usually open in your browser at `http://localhost:5173` (or a similar port).

### 4. Notes Summarization API Setup

The Notes Summarization API is a separate Python Flask application.

**Prerequisites:**
* Python 3.x
* `pip` (Python package installer)

1.  **Navigate into the `note-summarization` directory:**
    ```bash
    cd shelfshare/note-summarization
    ```
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt 
    ```
3.  **Set your Hugging Face API Token:**
    ```
    HF_TOKEN="YOUR_HUGGING_FACE_API_TOKEN"
    ```
4.  **Run the Flask application:**
    ```bash
    python app.py
    ```
    The API will typically run on `http://localhost:5000`.

---

## 📂 Folder Structure

### Backend (`shelfshare/backend`)

The backend handles all API requests, business logic, and interactions with the database.

#### Key Components:

* `Controllers/`: Manages HTTP endpoints and request handling.
    * Example: `AnonymousBookController.java`
* `Services/`: Contains the core business logic and orchestrates data operations.
    * Example: `BookService.java`
* `Entities/`: Defines the data models that map to database tables.
    * Example: `Books.java`, `Users.java`
* `Models/`: Defines data transfer objects (DTOs) and response structures.
    * Example: `AnonymousBookResponse.java`

#### Backend Capabilities:

* Provides **RESTful API endpoints** for all features.
* Seamless **integration with PostgreSQL** for data management.
* Uses **Gradle** for efficient dependency management and build automation.
* **Sends transactional emails** (e.g., welcome, borrow request notifications).
* **Automated** cleanup of **expired borrow requests** via a scheduled task.

---

### Frontend (`shelfshare/frontend`)

The frontend provides the interactive user interface for Shelfshare, allowing users to browse, manage, and share books.

#### Key Components:

* `src/components/`: Modular and reusable React UI elements.
* `src/pages/`: Main application views/pages.
* **Axios:** Handles asynchronous API requests to the backend.
* **Tailwind CSS:** Used for utility-first styling and responsive design.

#### Frontend Capabilities:

* Intuitive **book Browse and searching**.
* Displays **all available books** in a user-friendly format.
* Shows a user's **borrowed books**.
* Presents **enlisted books** that are available for sharing.
* Provides details for **anonymous book entries**.
* Robust **integration with backend APIs** for all data operations.

---

## 💡 Future Enhancements (Ideas)

We have exciting plans for Shelfshare! Here are some ideas for future development:

* **Chat Feature:** Implement a real-time chat system for users to communicate about books or borrow requests.
* **Real-time Updates:** Utilize WebSockets to push instant notifications for events like new borrow requests or status changes.
* **Enhanced Error Handling:** Develop more robust error handling and provide clearer, more helpful user feedback for various scenarios.
* **User Profiles:** Allow users to create more detailed personal profiles with preferred genres, reading history, etc.

