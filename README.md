# Chord & Lyric Management Application

A lightweight Web application built with Node.js, Express, and SQLite for managing and displaying song chords and lyrics with real-time dynamic transposition capabilities.

---

## Key Features

- **Song Catalog:** Displays all available songs sorted alphabetically by title.
- **Dynamic Transposition:** Transposes musical keys in real time using client-side JavaScript.
- **ChordPro Parsing:** Formats custom bracket notation `[Chord]` into aligned text displays.
- **Admin Management:** Provides a submission portal to add new song entries into the database.
- **Automatic Slug Generation:** Converts titles and artist names into clean, URL-friendly identifiers.
- **SQLite Performance Optimization:** Uses Write-Ahead Logging (WAL) for high-performance read and write access.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (via `better-sqlite3`)
- **Template Engine:** EJS (Embedded JavaScript)
- **Frontend Architecture:** Vanilla JavaScript, HTML5, CSS3

---

## Project Structure

```text
├── app.js               # Application entry point and route configurations
├── schema.js            # SQLite database initialization and model logic
├── package.json         # Dependencies and scripts
├── public/
│   └── js/
│       └── transposer.js # Client-side dynamic key transposition logic
└── views/
    ├── index.ejs        # Main public index view
    ├── detail.ejs       # Song view page with transposition controls
    └── admin.ejs        # Admin form for submitting new songs
```

---

## Database Architecture (ERD)

```mermaid
erDiagram
    SONGS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT title "NOT NULL"
        TEXT artist "NOT NULL"
        TEXT slug "UNIQUE, NOT NULL, INDEXED"
        TEXT content "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }
```

---

## Data Flow Diagrams (DFD)

### Data Flow Diagram Level 0 (Context Diagram)

```mermaid
graph TD
    User([User / Visitor])
    Admin([Administrator])
    System((Chord & Lyric System))

    User -->|Request Song List / View Song| System
    System -->|Render Songs & Render Transposed View| User

    Admin -->|Submit New Song Form| System
    System -->|Redirect / Status Notification| Admin
```

### Data Flow Diagram Level 1

```mermaid
graph TD
    User([User / Visitor])
    Admin([Administrator])

    P1((1.0 Read Songs))
    P2((2.0 Add Song))
    P3((3.0 Parse & Transpose))

    D1[(D1: Songs Database)]

    User -->|1. Request Homepage/Detail| P1
    P1 -->|Query Data| D1
    D1 -->|Return Song Data| P1
    P1 -->|Render List/Detail| User

    Admin -->|2. Submit Form Data| P2
    P2 -->|Generate Slug & Insert| D1
    D1 -->|Confirm Insertion| P2
    P2 -->|Redirect Status| Admin

    User -->|3. Change Transpose Key| P3
    P3 -->|Render Transposed Display| User
```

---

## Workflows and Flowcharts

### System Flowchart: User Navigation & Transposition

```mermaid
flowchart TD
    A[Start] --> B[Access Homepage /]
    B --> C[Fetch All Songs from Database]
    C --> D[Display Song List Page]
    D --> E{User Actions}
    
    E -->|Select Song| F[Navigate to /chord/:slug]
    F --> G[Fetch Song by Slug]
    G --> H{Song Exists?}
    H -->|No| I[Render 404 Not Found]
    H -->|Yes| J[Render Detail Page with Raw Content]
    J --> K[Initialize transposer.js]
    K --> L[Parse ChordPro Format & Display]
    L --> M{User Transposes Key?}
    M -->|Click +1 or -1| N[Recalculate Chord Semitones]
    N --> L
    
    E -->|Access Admin| O[Navigate to /admin]
```

### System Flowchart: Admin Song Addition

```mermaid
flowchart TD
    A[Start Admin Route] --> B[Render /admin Form]
    B --> C[Admin Fills Form Title, Artist, Content]
    C --> D[Submit Form POST /admin/add]
    D --> E[Generate Slug: title + artist]
    E --> F[Execute SQL Insert Query]
    F --> G{Insert Successful?}
    G -->|Yes| H[Redirect to Homepage /]
    G -->|No: SQLITE_CONSTRAINT_UNIQUE| I[Return 400: Song Already Exists]
    G -->|No: Other Error| J[Return 500: Server Error]
```

---

## Installation & Setup

1. **Clone or Extract Project Files**
   Ensure all files match the structural layout shown in the repository.

2. **Install Dependencies**
   Run the following command in the root folder:
   ```bash
   npm install
   ```

3. **Start the Application**
   ```bash
   node app.js
   ```

4. **Access in Browser**
   - Main Page: `http://localhost:3000`
   - Admin Input Page: `http://localhost:3000/admin`