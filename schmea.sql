DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE employee (
	employee_id INT NOT NULL AUTO_INCREMENT
	,first_name VARCHAR (30)
    ,last_name VARCHAR (30)
    ,role_id INT 
    ,department_id INT
    ,FOREIGN KEY (role_id) REFERENCES emp_role(role_id)
	,FOREIGN KEY (department_id) REFERENCES department(department_id)
    ,PRIMARY KEY (employee_id)
);

SELECT * FROM employee;

CREATE TABLE emp_role(
	role_id INT NOT NULL AUTO_INCREMENT
    ,title VARCHAR (30)
    ,salary DECIMAL (10,2)
    ,department_id INT
    ,FOREIGN KEY (department_id) REFERENCES department(department_id)
    ,PRIMARY KEY (role_id)
);
SELECT * FROM role;

CREATE TABLE department(
	department_id INT NOT NULL AUTO_INCREMENT
    ,name VARCHAR (30)
    ,PRIMARY KEY(department_id)
);
SELECT * FROM department;

SELECT id FROM department WHERE name = "Mens";

SELECT employee.first_name, employee.last_name, emp_role.title, emp_role.salary, department.name
From employee 
INNER JOIN  emp_role ON employee.role_id = emp_role.role_id
INNER JOIN department ON employee.department_id = department.department_id
WHERE department.department_id = 2;

SELECT employee.first_name, employee.last_name, emp_role.title, emp_role.salary, department.name
From employee 
INNER JOIN  emp_role ON employee.role_id = emp_role.role_id
INNER JOIN department ON employee.department_id = department.department_id
WHERE emp_role.role_id = 4;