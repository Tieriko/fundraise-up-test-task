# FundraiseUp Tracker Test Task

## Prerequisites
```
Node.js (v16.x or higher)
npm (v6.x or higher)
```
___

## Installation

Clone the repository:

```BASH
git clone https://github.com/Tieriko/fundraise-up-test-task.git
```

Install dependencies:

```
npm install
```
___
## Configuration

Create a `.env` file in the root directory of the project to set the environment variables:

```BASH
touch .env
```

Open the .env file in your preferred text editor and add the following variables:
```MAKEFILE
DATA_PORT=8888
HTML_PORT=50000
ALLOWED_ORIGINS=http://localhost:50000
MONGO_URL="mongodb+srv://user:password@cluster0.mongodb.net/db_name?retryWrites=true&w=majority"
```
___
## DB generation and synchronization

Generate Prisma client:

```
npm run prisma:generate
```

Push the Prisma schema to the database:

```
npm run prisma:push
```
___

## Running the project

Build the tracker:

```
npm run build-tracker
```

Start the server:

```
npm run start
```
___

## Running tests

To run tests, execute the following command:

```
npm run test
```
___

## License

This project is licensed under the MIT License.
