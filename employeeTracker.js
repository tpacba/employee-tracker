var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "OneYear_95",
    database: "employeeTracker_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

// function start() {
//     var array = [];
//     connection.query(
//         "SELECT * FROM department",
//         function(err, data) {
//             if(err) throw err;
//             array.push(data);
//             console.log(array)
//         }
//     )
// }

function start() {
    inquirer
        .prompt({
            name: "add_view_update",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles", "Exit"]
        })
        .then(function(answer) {
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
        }).then(function(answer) {
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
        }).then(function(answer) {
            if (answer.addWhat === "Departments") {
                viewDepartments();
            }
            else if (answer.addWhat === "Roles") {
                viewRoles();
            }
            else if (answer.addWhat === "Employees") {
                viewEmployees();
            }
            else {
                connection.end();
            }
        })
}

function update() {

}

function addDepartments() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the department (to add)?"
        })
        .then(function(answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function(err) {
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
        "SELECT name FROM department",
        function(err, data) {
            data.forEach(function(item) {
                departmentData.push(item.name)
            });
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
                name: "department",
                type: "list",
                message: "Which department does this role belong in?",
                choices: departmentData
            }
        ])
        // .then(function(answer) {
        //     connection.query(
        //         "INSERT INTO role SET ?",
        //         {
        //             name: answer.name
        //         },
        //         function(err) {
        //             if (err) throw err;
        //             console.log(`You added the department ${answer.name} successfully!`)
        //             start();
        //         }
        //     )
        // })
}