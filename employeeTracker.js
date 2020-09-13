var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "OneYear_95",
    database: "employeeTracker_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "add_view_update",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles", "Exit"]
        })
        .then(function (answer) {
            if (answer.add_view_update === "Add departments, roles, employees") {
                add();
            }
            else if (answer.add_view_update === "View departments, roles, employees") {
                view();
            }
            else if (answer.add_view_update === "Update employee roles") {
                update();
            }
            else {
                connection.end();
            }
        })
}

function add() {
    inquirer
        .prompt({
            name: "addWhat",
            type: "list",
            message: "What would you like to add?",
            choices: ["Departments", "Roles", "Employees"]
        }).then(function (answer) {
            if (answer.addWhat === "Departments") {
                addDepartments();
            }
            else if (answer.addWhat === "Roles") {
                addRoles();
            }
            else if (answer.addWhat === "Employees") {
                addEmployees();
            }
            else {
                connection.end();
            }
        })
}

function view() {
    inquirer
        .prompt({
            name: "viewWhat",
            type: "list",
            message: "What would you like to view?",
            choices: ["Departments", "Roles", "Employees"]
        }).then(function (answer) {
            if (answer.viewWhat === "Departments") {
                viewDepartments();
            }
            else if (answer.viewWhat === "Roles") {
                viewRoles();
            }
            else if (answer.viewWhat === "Employees") {
                viewEmployees();
            }
            else {
                connection.end();
            }
        })
}

function update() {
    var roleData = [];
    connection.query(
        "SELECT * FROM role",
        function (err, data) {
            if (err) throw err;
            roleData = data;
        }
    )

    var employeeData = [];
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.name AS role FROM employee LEFT JOIN role ON employee.role_id = role.id",
        function (err, data) {
            if (err) throw err;
            employeeData = data;

            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to update role?",
                        choices: function () {
                            var employeeChoices = [];
                            for (const item of employeeData) {
                                employeeChoices.push(`${item.first_name} ${item.last_name} (${item.role}) ID:${item.id}`);
                            }
                            return employeeChoices
                        }
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: function () {
                            var roleChoices = [];
                            for (const item of roleData) {
                                roleChoices.push(`${item.id}. ${item.name}`);
                            }
                            return roleChoices;
                        }
                    }
                ])
                .then(function (answer) {
                    connection.query(
                        "UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: answer.role.split(".")[0]
                            },
                            {
                                id: answer.employee.split("ID:")[1]
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log(`You updated the role ${answer.role.split(". ")[1]} for ${answer.employee.split(" (")[0]}`);
                            start();
                        }
                    )
                })
        }
    )
}

function addDepartments() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the department (to add)?"
        })
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function (err) {
                    if (err) throw err;
                    console.log(`You added the department ${answer.name} successfully!`)
                    start();
                }
            )
        })
}

function addRoles() {
    var departmentData = [];
    connection.query(
        "SELECT * FROM department",
        function (err, data) {
            if (err) throw err;
            departmentData = data;
        }
    )

    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of this role (to add)?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this role?"
            },
            {
                name: "departmentName",
                type: "list",
                message: "Which department does this role belong in?",
                choices: function () {
                    var departmentChoices = [];
                    for (const item of departmentData) {
                        departmentChoices.push(item.name);
                    }
                    return departmentChoices;
                }
            }
        ])
        .then(function (answer) {
            var id;
            for (const item of departmentData) {
                if (answer.departmentName == item.name) {
                    id = item.id;
                }
            }

            connection.query(
                "INSERT INTO role SET ?",
                {
                    name: answer.name,
                    salary: answer.salary,
                    department_id: id
                },
                function (err) {
                    if (err) throw err;
                    console.log(`You added the role ${answer.name}, ${answer.salary}, ${answer.departmentName} successfully!`)
                    start();
                }
            )
        })
}

function addEmployees() {
    var roleData = [];
    connection.query(
        "SELECT * FROM role",
        function (err, data) {
            if (err) throw err;
            roleData = data;
        }
    )

    var employeeData = [];
    connection.query(
        "SELECT * FROM employee",
        function (err, data) {
            if (err) throw err;
            employeeData = data;
        }
    )

    inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastname",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "roleName",
                type: "list",
                message: "What is the employee's role?",
                choices: function () {
                    var roleChoices = [];
                    for (const item of roleData) {
                        roleChoices.push(item.name);
                    }
                    return roleChoices;
                }
            },
            {
                name: "managerName",
                type: "list",
                message: "Who is the employee's manager?",
                choices: function () {
                    var managerChoices = ["null"];
                    for (const item of employeeData) {
                        managerChoices.push(item.last_name);
                    }
                    return managerChoices;
                }
            }
        ])
        .then(function (answer) {
            var roleID;
            for (const item of roleData) {
                if (answer.roleName == item.name) {
                    roleID = item.id;
                }
            }

            var managerID = null;
            for (const item of employeeData) {
                if (answer.managerName == item.last_name) {
                    managerID = item.id;
                }
            }

            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: roleID,
                    manager_id: managerID
                },
                function (err) {
                    if (err) throw err;
                    console.log(`You added the employee ${answer.lastname}, ${answer.roleName} successfully!`)
                    start();
                }
            )
        })
}

function viewDepartments() {
    console.log("View Departments");

    connection.query(
        "SELECT * FROM department",
        function (err, data) {
            if (err) throw err;
            console.table(data);
            start();
        }
    )
};

function viewRoles() {
    console.log("View Roles");

    connection.query(
        "SELECT role.id, role.name AS role, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id;",
        function (err, data) {
            if (err) throw err;
            console.table(data);
            start();
        }
    )
};

function viewEmployees() {
    console.log("View Employees");

    connection.query(
        "CREATE TABLE manager (id INT NOT NULL AUTO_INCREMENT, last_name VARCHAR(30) NOT NULL, PRIMARY KEY (id))",
        function (err) {
            if (err) throw err;

            connection.query(
                "INSERT INTO manager (last_name) SELECT last_name FROM employee",
                function (err) {
                    if (err) throw (err);

                    connection.query(
                        "SELECT employee.id, employee.first_name, employee.last_name, role.name AS role, manager.last_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN manager ON employee.manager_id = manager.id",
                        function (err, data) {
                            if (err) throw err;
                            console.table(data);

                            connection.query(
                                "DROP TABLE manager",
                                function (err) {
                                    if (err) throw err;
                                    start();
                                }
                            )
                        }
                    )
                }
            )
        }
    )
};
