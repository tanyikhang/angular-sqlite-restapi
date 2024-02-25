1) Download Visual Studio Code, and Node.js
2) Open new window in Visual Studio code
3) Clone Git Repository: https://github.com/tanyikhang/angular-sqlite-restapi
4) Direct to the file and start the server in a terminal, ..\todoapp-angular-mongodb-api\api> 
  i) npm install sqlite3
  ii) npm install sequelize sqlite3
  iii) node index.js
5) open terminal, direct to the file location (exp: ..\todoapp-angular-mongodb-api\angular-todoapp-ui-main> npm install) and run 
  i) npm install 
  ii) npm install @ng-bootstrap/ng-bootstrap
  iii) npm install -g @angular/cli
  iv) ng serve -o
7) After running, it should be no data yet in the database, you may click  "Add note" to add a note and proceed to other function to test.

Note:

In the ..\todoapp-angular-mongodb-api\api\index.js,
I declared storage: ':memory:' for database exists only for the duration of the program execution, it will be deleted after that.

To work with a file-based SQLite database and persist data across program executions, you need to specify a file path instead of :memory:. For example:

// Specify the path to your SQLite database file
const dbPath = "d:/Database/sqlite-tools-win-x64-3450100/angular.db"; //sqlite3 database path

// Initialize Sequelize with SQLite database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    //storage: ':memory:',
    storage: dbPath,
    logging: false // disable logging to console
});
