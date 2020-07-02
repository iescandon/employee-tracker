var inquirer = require("inquirer");
var mysql = require("mysql2");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "cms_db",
});

connection.connect(function (err) {
    if (err) {
        console.error("error connection: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    init();
});

var choices = [
    "View ALL Employees",
    "View ALL Employees by Department",
    "View ALL Employees by Roles",
    "Add Employee",
    "Add Department",
    "Add Role",
    "Remove Employee",
    "Remove Department",
    "Remove Role",
    "Update Employee Role",
];

var departments = [];
connection.query("SELECT department FROM department", function (err, res) {
    res.forEach((item) => {
        departments.push(item.department);
    });
});

var roles = [];
connection.query("SELECT title FROM role", function (err, res) {
    res.forEach((item) => {
        roles.push(item.title);
    });
});

function init() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: choices,
            },
        ])
        .then(function (response) {
            switch (response.choice) {
                case "View ALL Employees":
                    viewEmp();
                    break;
                case "View ALL Employees by Department":
                    viewDept();
                    break;
                case "View ALL Employees by Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Employee":
                    removeEmp();
                    break;
                case "Remove Department":
                    removeDept();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Update Employee Role":
                    updateEmp();
                    break;
            }
        });
}

function viewEmp() {
    const query = `
        SELECT a.id, a.first_name, a.last_name, b.title, c.department, b.salary
        FROM employee a
        INNER JOIN role b ON (a.role_id = b.id)
        INNER JOIN department c ON (b.department_id = c.id)
        ORDER BY a.id
        `;
    connection.query(query, function (err, res) {
        console.table(res);
        init();
    });
}

function viewDept() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "dept",
                message: "Which department would you like to view?",
                choices: departments,
            },
        ])
        .then(function (response) {
            const query = `
                SELECT a.id, a.first_name, a.last_name, b.title, c.department, b.salary
                FROM employee a
                INNER JOIN role b ON (a.role_id = b.id)
                INNER JOIN department c ON (b.department_id = c.id)
                WHERE c.department = ?
            `;
            connection.query(query, response.dept, function (err, res) {
                console.table(res);
                init();
            });
        });
}

function viewRoles() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "role",
                message: "Which role would you like to view?",
                choices: roles,
            },
        ])
        .then(function (response) {
            const query = `
                SELECT a.id, a.first_name, a.last_name, b.title, c.department, b.salary
                FROM employee a
                INNER JOIN role b ON (a.role_id = b.id)
                INNER JOIN department c ON (b.department_id = c.id)
                WHERE b.title = ?
            `;
            connection.query(query, response.role, function (err, res) {
                console.table(res);
                init();
            });
        });
}

function addEmp() {
    console.log("add employee");
}

function addDept() {
    console.log("add department");
}

function addRole() {
    console.log("add role");
}

function removeEmp() {
    console.log("remove employee");
}

function removeDept() {
    console.log("remove department");
}

function removeRole() {
    console.log("remove role");
}

function updateEmp() {
    console.log("update employee");
}
