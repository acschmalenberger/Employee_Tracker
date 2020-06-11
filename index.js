const inquirer = require("inquirer");
const mysql = require("mysql")
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "sen8toR!",
    database: "employee_tracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    
    start();
});

function start(){
    inquirer
        .prompt({
            name: "start",
            type: "list",
            message: "what would you like to do today?",
            choices:[
                "View Departments",
                "View Roles",
                "View Employees",
                "Add departments",
                "Add roles",
                "Add Empployees",
                "Update Current Employees",
            ]
        })
        .then(function(answer){
            
            if (answer.start === "View Departments"){
                viewDepartments();
            }
            else if (answer.start === "View Roles"){
                viewRoles();
            }
            else if(answer.start==="View Employees"){
                viewEmployees();
            }
            else if(answer.start=== "Add departments"){
                addDepartments()
            }
            else if(answer.start==="Add roles"){
                addRoles();
            }
            else if(answer.start=== "Add Empployees"){
                addEmployees();
            }
            else{
                updateEmployees();
            }
        })
}

function viewDepartments(){
    
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to view?",
            choices:[
                "Storewide",
                "Mens",
                "Womens",
            ]
        })
        //make a query that will associate the answer.department with department id
        .then(function(answer){
            
            var query = "SELECT department_id FROM department WHERE ?";
            connection.query(query, {"dep_name":answer.department}, function(err,res){
                
                // var deptId = res[0].department_id
                // console.log(deptId)

                if (err) throw err;
                var query = `
                    SELECT employee.first_name, employee.last_name, emp_role.title, emp_role.salary, department.dep_name
                    From employee 
                    INNER JOIN  emp_role ON employee.role_id = emp_role.role_id
                    INNER JOIN department ON employee.department_id = department.department_id
                    WHERE ?
                    `;
                    
                    connection.query(query, {"department.department_id": res[0].department_id}, function(err,res){
                        // console.log(steve)
                        if (err) throw err;
                        
                        //need to figure out how to get everything on one table
                        for (var i =0; i<res.length; i++){
                        var depTable = cTable.getTable(res);
                        }
                        console.log(depTable)
                        start();
                    })
            })
        })
            
}

function viewRoles(){
    inquirer
    .prompt({
        name: "role",
        type: "list",
        message: "Which role would you like to look at",
        choices:[
            "Owner",
            "Manager",
            "Assistant Manager",
            "Personal Shopper",
            "Sales",
            "Stock"
        ]
    })
    .then(function(answer){
        var query = "SELECT role_id FROM emp_role WHERE ?";
        connection.query(query, {"title":answer.role}, function(err,res){
            if (err) throw err;
            console.log(query)
            var query = `
                SELECT employee.first_name, employee.last_name, emp_role.title, emp_role.salary, department.dep_name
                From employee 
                INNER JOIN  emp_role ON employee.role_id = emp_role.role_id
                INNER JOIN department ON employee.department_id = department.department_id
                WHERE ?
                `;
                
                connection.query(query, {"emp_role.role_id": res[0].role_id}, function(err,res){
    
                    if (err) throw err;
                    
                    for (var i =0; i<res.length; i++){
                    var depTable = cTable.getTable(res);
                    }
                    console.log(depTable);
                    start();
                })
        })
    })
}


function viewEmployees(){
    inquirer
    .prompt({
        name: "lastName",
        type: "list",
        message: "Choose the last name of the employee you would like to view",
        choices:[
            "Ford",
            "Miller",
            "Smith",
            "Schmidt",
            "Munson",
            "Ferguson",
            "Guerrero",
            "Shariff",
            "Miner",
            "Rudolph",
        ]
    })
    .then(function(answer){
        var query = "SELECT employee_id FROM employee WHERE ?";
        connection.query(query, {"last_name":answer.lastName}, function(err,res){
            if (err) throw err;
            console.log(query)
            var query = `
                SELECT employee.first_name, employee.last_name, emp_role.title, emp_role.salary, department.dep_name
                From employee 
                INNER JOIN  emp_role ON employee.role_id = emp_role.role_id
                INNER JOIN department ON employee.department_id = department.department_id
                WHERE ?
                `;
                
                connection.query(query, {"employee.employee_id": res[0].employee_id}, function(err,res){
    
                    if (err) throw err;
                    
                    for (var i =0; i<res.length; i++){
                    var depTable = cTable.getTable(res);
                    console.log(depTable); 
                    }
                    
                    start();
                })
        })
        start()
    })

}

function addDepartments(){
    inquirer
    .prompt(
        {
            name: "addDep",
            type: "input",
            message: "What is the name of the Department you would like to add?",
        }
    )
    .then(function(answer){
        console.log(answer)
        var query = "INSERT INTO department (dep_name) VALUES?";
        //needs some troubleshooting
        connection.query(query, {"dep_name":answer.addDep}, function(err,res){
            if (err) throw err;
            console.log("Added department named:"+res)
        start()
        })

    })
}

function addRoles(){
    inquirer
    .prompt(
        {
            name: "addRole",
            type: "input",
            message: "What role would you like to add?",
        },
        {
            name: "addSalary",
            type: "input",
            message: "What is the salary for this new role?",
        },
        {
            name: "addRoleDep",
            type:"list",
            message: "what deparment is this new role in?",
            choices:[
                "Manager",
                "Assistant Manager",
                "Personal Shopper",
                "Sales",
                "Stock",
            ]
        }    
    )
    .then(function(answers){
        // console.log(answers)
        var query = "INSERT INTO emp_role(title, salary, departmet) VALUES?";
        //needs some troubleshooting
        connection.query(query, {"title":answers.addRole, "salary": answers.addSalary, "department":answers.addRoleDep}, function(err,res){
            if (err) throw err;
            console.log("Added a new role wirh the title: "+res.title || "Salary: "+res.salary || "Department: "+res.department)
        start()
        })

    })
}

function addEmployees(){
    inquirer
    .prompt(
        {
            name: "newFirst",
            type: "input",
            message: "what is the first name of the employee you would like to add?",
        },
        {
            name: "newLast",
            type: "input",
            message: "what is the last name of the employee you would like to add?"
        },
        {
            name: "newRole",
            type: "list",
            message: "what is the employee's role?",
            choices:[
                "Manager",
                "Assistant Manager",
                "Personal Shopper",
                "Sales",
                "Stock",
            ]
        },
        {
            name: "newDep",
            type: "list",
            message: "which department is the employee in?",
            choices:[
                "Storewide",
                "Mens",
                "Womens",
            ]
        }
    )
    .then(function(answer){
        var query = "INSERT INTO emp_role(title, salary, departmet) VALUES?";
        //needs some troubleshooting
        //role id and deparment id will need to be looked up to enter things into database correctly but the name will have to be pushed our for better UE
        connection.query(query, {"first_name":answer.newFirst, "last_name": answer.newLast, "role_id":answer.newRole, "department_id": answer.newDept}, function(err,res){
            if (err) throw err;
            console.log("Added a new employee names: "+res.first_name+" "+res.last_name || "Role: "+res.role_id || "Department: "+res.department_id)
        start()
        })
    })

}

// function updateEmployees(){
//     inquirer
//     .prompt({
//         //which employee would you like to update (choice)

//     })
//     .then(function(answer){

//         start()
//     })

// }

