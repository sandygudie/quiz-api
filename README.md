# Quiz-api

### Description

An open source RESTFUL API quiz questions for popular programming languages. It consists of Multiple Choice Questions(MCQs) in various areas including: HTML,CSS,JavaScript. NextJs etc.

### Deployment

- Documentation: https://sandygudie.github.io/quiz-api/#/
- Postman API Documentation: https://documenter.getpostman.com/view/9434341/2s93JtRPcV
- Demo App:

### Technology/Tools

- [**NodeJs 4.18.2**](https://nodejs.org/en/) - A cross-platform JavaScript runtime environment for developing server-side applications
- [**Express 4.18.2**](https://expressjs.com/) - A NodeJs web application framework that helps manage servers and routes.
- [**Mongoose ^7.0.0**](https://www.mongodb.com/) - A non-relational Database
- [**Eslint ^7.32.0 || ^8.2.0**](https://eslint.org/) - Handles codebase Linting, (Eslint standard used)
- [**Prettier ^2.8.4**](https://prettier.io/) - Code formatter to to make code base look pretty
- [**Husky ^8.0.3**](https://github.com/typicode/husky) and [**lint-staged ^13.2.0**](https://github.com/okonet/lint-staged) - Pre-commit hooks that runs on `git commit`

### Project Folder Structure

```
.husky
node_modules/
docs/
src/
   --config
     --config.js
     --logger.js
   --controllers/
     --auth.js
     --quiz.js
     --user.js
   --routes/
     --auth.js
     --quiz.js
     --index.js
     --user.js
   --models/
     --quiz.js
     --user.js
   --middlewares/
     --error-handler.js
   --db/
     --db.js
   --utils/
     --sendEmail
        --templates
          --index.ejs
        --emailhandler.js
     --responseHandler.js
     --token
   app.js
   server.js
.env-example
package.json
```

### Environment Setup

- Make sure you have **nodejs** installed by running the following command below. You can install **nodejs ** from [here](https://nodejs.org/en/download/) if you don't have it.
  ```
  node -v
  ```
- Clone the respository to your local machine using the command
  ```
  git clone https://github.com/sandygudie/quiz-api.git
  ```
- Navigate to the project folder.
- And open the project with your code editor (VScode recommended)
- Then install the package dependencies by running the following command in the terminal:
  ```
  yarn install
  ```

### Start the server

- Create a `.env` in the project folder, get variables from the `.env.example` file sample and ensure to add the values(e.g MONGODB_URI)
- To start the server locally, run the command
  ```
   yarn run dev
  ```

### Formatting for the project

- We're using `eslint` for js linting, and `prettier` for code formatting.
- Please make it a point to install `eslint` and `prettier` plugins on vscode to aid in your coding process.
- Run the command to fix all auto-fixable formatting errors in the whole project based on `eslint` rules
  ```
  yarn run lint
  ```
- Run the command to check and fix file formatting with `prettier`
  ```
  yarn run format
  ```
- Also Linting has been set up for staged commits in the project.

  <br/>
  <br/>

### Deployment on Render
- Application is on auto deploy from github

## CONTRIBUTING WORKFLOW

- If you like it, leave your star in this project.
- If you would like to complain/suggest/contribute to this project, feel free to open a issue :heart_decoration:
