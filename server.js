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
    "View ALL Employees by Roles",
    "View ALL Employees by Department",
    "Add Employee",
    "Add Role",
    "Add Department",
    "Remove Employee",
    "Remove Role",
    "Remove Department",
    "Update Employee Role",
    "Exit",
];
var departments = [];
var roles = [];
var rolesIDS = [];
var employees = [];

function getDept() {
    connection.query("SELECT department FROM department", function (err, res) {
        res.forEach((item) => {
            departments.push(item.department);
        });
    });
}

function getRoles() {
    connection.query("SELECT id, title FROM role", function (err, res) {
        res.forEach((item) => {
            roles.push(item.title);
        });
        res.forEach((item) => {
            var obj = {
                id: item.id,
                role: item.title,
            };
            rolesIDS.push(obj);
        });
    });
}

function getEmp() {
    connection.query("SELECT first_name, last_name FROM employee", function (
        err,
        res
    ) {
        res.forEach((item) => {
            var fullName = `${item.first_name} ${item.last_name}`;
            employees.push(fullName);
        });
    });
}

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
                case "View ALL Employees by Roles":
                    viewRoles();
                    break;
                case "View ALL Employees by Department":
                    viewDept();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Remove Employee":
                    removeEmp();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Remove Department":
                    removeDept();
                    break;
                case "Update Employee Role":
                    updateEmp();
                    break;
                case "Exit":
                    connection.end();
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

function addEmp() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message:
                    "What is the first name of the employee you would like to add?",
            },
            {
                type: "input",
                name: "lastName",
                message:
                    "What is the first name of the employee you would like to add?",
            },
            {
                type: "list",
                name: "role",
                message: "Choose the role of the new employee:",
                choices: roles,
            },
        ])
        .then(function (response) {
            var roleID = "";
            rolesIDS.forEach((item) => {
                if (response.role === item.role) {
                    roleID = item.id;
                }
            });
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: roleID,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee added successfully!");
                    init();
                }
            );
        });
}

function addRole() {
    console.log("add roles");
}

function addDept() {
    console.log("add department");
}

function removeEmp() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to remove?",
                choices: employees,
            },
        ])
        .then(function (response) {
            var name = response.employee.split(" ");

            connection.query(
                "DELETE FROM employee WHERE ? AND ?",
                {
                    first_name: name[0],
                },
                {
                    last_name: name[1],
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee removed successfully!");
                    init();
                }
            );
        });
}

function removeRole() {
    console.log(roles);
}

function removeDept() {
    console.log(departments);
}

function updateEmp() {
    console.log("update employee");
}

getDept();

getRoles();

getEmp();
