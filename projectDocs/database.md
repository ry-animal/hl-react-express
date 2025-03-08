1. Database Connection and Management:

Rule: Establish a clear convention for managing database connections.
Rationale: Proper connection handling is crucial for performance and preventing database corruption.
Example: "Use a dedicated db/index.js or db/index.ts file to initialize and export the SQLite database connection. Ensure connections are closed when no longer needed."
Rule: Define a consistent location for your SQLite database file.
Rationale: Standardizes file placement for easier access and management.
Example: "Place the SQLite database file (mydb.sqlite) in the backend/db/ directory." 2. Schema Definition and Management:

Rule: Use an ORM or database toolkit (like Drizzle or Prisma) to define and manage your schema.
Rationale: ORMs simplify schema management, provide type safety, and handle migrations.
Example: "Use Drizzle with TypeScript to define the database schema in backend/db/schema.ts. Employ Drizzle Kit for database migrations."
Rule: Follow consistent naming conventions for tables and columns.
Rationale: Improves code readability and maintainability.
Example: "Use snake_case for table and column names (e.g., user_profiles, created_at)."
Rule: Document your database schema thoroughly.
Rationale: Ensures clarity and understanding of the database structure.
Example: "Add comments to your schema definitions explaining the purpose of each table and column." 3. Query Writing and Execution:

Rule: Use parameterized queries to prevent SQL injection vulnerabilities.
Rationale: Protects your application from malicious input.
Example: "Always use parameterized queries when inserting, updating, or selecting data (e.g., db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]))."
Rule: Optimize queries for performance.
Rationale: Ensures efficient data retrieval.
Example: "Use appropriate indexes on frequently queried columns. Analyze query execution plans to identify performance bottlenecks."
Rule: Handle database errors gracefully.
Rationale: Prevents application crashes and provides informative error messages.
Example: "Wrap database operations in try-catch blocks and log or display appropriate error messages."
Rule: Use Cursor to generate and explain sql queries.
Rationale: leverage the ai to help generate and explain complex sql queries.
Example: "Use the @ symbol in cursor to ask it to generate sql queries, and then ask it to explain the generated query." 4. Code Organization and Best Practices:

Rule: Separate database logic from application logic.
Rationale: Improves code modularity and maintainability.
Example: "Create dedicated database service or repository classes to handle database interactions."
Rule: Use transactions to ensure data integrity.
Rationale: Prevents partial updates and maintains data consistency.
Example: "Wrap multiple database operations in a transaction to ensure atomicity."
Rule: Write unit tests for database interactions.
Rationale: Verifies the correctness of database logic.
Example: "Use a testing framework (e.g., Jest) to write unit tests for your database service or repository classes."
Rule: Use Cursor to generate and explain code.
Rationale: Leverage the AI to increase speed of development, and to better understand code.
Example: "Use the @ symbol in cursor to ask it to generate functions that interact with the database, and then ask it to explain the generated code."
