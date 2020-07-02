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
    "View ALL Employees by Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View ALL Roles",
    "Add Role",
    "Remove Role",
];

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
                case "View ALL Employees by Manager":
                    viewManager();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Remove Employee":
                    removeEmp();
                    break;
                case "Update Employee Role":
                    updateEmp();
                    break;
                case "Update Employee Manager":
                    updateManager();
                    break;
                case "View ALL Roles":
                    viewRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
            }
        });
}

function viewEmp() {
    const query = `
        SELECT a.id, a.first_name, a.last_name, b.title, c.name, b.salary
        FROM employee a
        INNER JOIN role b ON (a.role_id = b.id)
        INNER JOIN department c ON (b.department_id = c.id)
        ORDER BY a.id
        `;
    connection.query(query, function (err, res) {
        // console.table(res);
        var empArray = [];
        res.forEach((employee) => {
            var obj = {
                ID: employee.id,
                "First Name": employee.first_name,
                "Last Name": employee.last_name,
                Title: employee.title,
                Department: employee.name,
                Salary: employee.salary,
            };
            empArray.push(obj);
        });
        console.table(empArray);
        init();
    });
}

function viewDept() {
    console.log("view department");
}

function viewManager() {
    console.log("view manager");
}

function addEmp() {
    console.log("add employee");
}

function removeEmp() {
    console.log("remove employee");
}

function updateEmp() {
    console.log("update employee");
}

function updateManager() {
    console.log("update manager");
}

function viewRoles() {
    console.log("view roles");
}

function addRole() {
    console.log("add role");
}

function removeRole() {
    console.log("remove role");
}
