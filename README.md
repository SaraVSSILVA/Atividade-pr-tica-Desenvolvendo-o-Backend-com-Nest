<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🎮 Games Store Backend

Backend built with [NestJS](https://nestjs.com/) for a game store, with the ability to manage product and category data. This project follows best practices for development and layered architecture (Entity, Service, Controller) and uses MySQL as its database.

---

## 🚀 Features

* **Complete Category CRUD:**
    * Create, list, find by ID, update, and delete game categories.
* **Complete Product CRUD:**
    * Create, list, find by ID, update, and delete product (game) data.
* **One-to-Many Relationship:**
    * A Category can have multiple Products, and a Product belongs to a single Category.
    * Implemented a restriction (`onDelete: 'RESTRICT'`) to prevent the deletion of categories that still have associated products.
* **Data Validation:**
    * Uses Data Transfer Objects (DTOs) with `class-validator` to ensure data integrity in requests.

---

## 🛠️ Technologies Used

* **[NestJS](https://nestjs.com/):** A progressive Node.js framework for building efficient and scalable server-side applications.
* **[TypeORM](https://typeorm.io/#/):** An ORM (Object Relational Mapper) for TypeScript and JavaScript, allowing interaction with the database using classes and objects.
* **[MySQL](https://www.mysql.com/):** A relational database management system.
* **[Docker](https://www.docker.com/):** (Optional, but recommended for development environment) A platform for developing, shipping, and running applications in containers.
* **[class-validator](https://github.com/typestack/class-validator):** A library for object validation.
* **[class-transformer](https://github.com/typestack/class-transformer):** A library for object transformation.

---

## ⚙️ Prerequisites

Before you start, make sure you have the following tools installed on your machine:

* **[Node.js](https://nodejs.org/):** (version 18.x or higher)
* **[npm](https://www.npmjs.com/)** or **[Yarn](https://yarnpkg.com/):** Package manager.
* **[MySQL Server](https://www.mysql.com/downloads/):** Installed locally or via Docker.
* **[Docker](https://www.docker.com/get-started):** (Optional, but recommended for running MySQL in a container).
* **[Git](https://git-scm.com/):** Version control system.

---

## 🚀 Setup and Running the Application

Follow the steps below to set up and run the project on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/SaraVSSILVA/Atividade-pr-tica-Desenvolvendo-o-Backend-com-Nest.git](https://github.com/SaraVSSILVA/Atividade-pr-tica-Desenvolvendo-o-Backend-com-Nest.git)
cd Atividade-pr-tica-Desenvolvendo-o-Backend-com-Nest
````
2. Install Dependencies
   
````bash

npm install
````
# or
```
yarn install
````

3. Configure the MySQL Database
   
You can use Docker to quickly start a MySQL container or install MySQL directly on your machine.

Option A: Using Docker (Recommended)
Make sure Docker is running.

Execute the command to start a MySQL container:

````Bash

docker run --name games-store-mysql -e MYSQL_ROOT_PASSWORD=your_root_password -e MYSQL_DATABASE=games_store_db -p 3306:3306 -d mysql:8
````
Important: Replace your_root_password with a strong password of your choice.
(Optional, but good practice) Create a specific user for the application:

```Bash

docker exec -it games-store-mysql mysql -u root -p
````
# Enter your_root_password when prompted
At the MySQL prompt:

SQL
```
CREATE USER 'your_db_user'@'%' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON games_store_db.* TO 'your_db_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```
Replace your_db_user and your_db_password with the credentials you will use in the application.

Option B: Locally Installed MySQL
Ensure you have a MySQL server running at localhost:3306.

Create a database named games_store_db.

Create a user and password with permissions to access this database. Example via MySQL command line:

SQL
````
CREATE DATABASE games_store_db;
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON games_store_db.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
````
4. Configure Credentials in the Project
Open the src/app.module.ts file and update the database connection information with your credentials:

TypeScript

// src/app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
// ... other imports

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'your_db_user', // YOUR USERNAME HERE
      password: 'your_db_password', // YOUR PASSWORD HERE
      database: 'games_store_db',
      autoLoadEntities: true,
      synchronize: true, // CAUTION: Only use in development!
    }),
    // ... other modules
  ],
  // ...
})
export class AppModule {}
5. Start the Application
```Bash

npm run start:dev
````
# or
```
yarn start:dev
```
The application will be running at http://localhost:3000. Database tables will be automatically created by TypeORM on the first run due to synchronize: true.

🧪 Testing the API with Insomnia/Postman
You can use tools like Insomnia or Postman to test the API endpoints.

Category Endpoints (/categories)
POST /categories: Creates a new category.

Body: {"name": "Action", "description": "Action games."}

GET /categories: Lists all categories.

GET /categories/:id: Retrieves a category by ID.

PUT /categories/:id: Updates a category.

Body: {"name": "Action and Adventure"}

DELETE /categories/:id: Deletes a category. (Note the restriction: cannot delete if there are associated products).

Product Endpoints (/products)
POST /products: Creates a new product.

Body: {"name": "The Witcher 3", "description": "Fantasy RPG.", "price": 49.99, "stock": 50, "isAvailable": true, "categoryId": 1}

(Important: categoryId must be an existing category ID.)

GET /products: Lists all products (includes associated category details).

GET /products/:id: Retrieves a product by ID (includes associated category details).

PUT /products/:id: Updates a product.

Body: {"price": 39.99, "stock": 40}

DELETE /products/:id: Deletes a product.

🤝 Contribution

Contributions are welcome! Feel free to open issues or pull requests.

📄 License
This project is licensed under the MIT License.
