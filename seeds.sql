INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Accounting");
INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Customer Relations");
INSERT INTO department (name) VALUES ("Quality Assurance");


INSERT INTO role (name, salary, department_id) VALUES ("Sales Manager", 125000, 1);
INSERT INTO role (name, salary, department_id) VALUES ("Sales Associate", 100000, 1);
INSERT INTO role (name, salary, department_id) VALUES ("Accountant", 75000, 2);
INSERT INTO role (name, salary, department_id) VALUES ("HR Rep", 75000, 3);
INSERT INTO role (name, salary, department_id) VALUES ("Customer Service Rep", 50000, 4);
INSERT INTO role (name, salary, department_id) VALUES ("Office Secretary", 50000, 4);
INSERT INTO role (name, salary, department_id) VALUES ("Vendor Liason", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Scott", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dwight", "Schrutte", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jim", "Halpert", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Malone", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Toby", "Flenderson", 4, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kelly", "Kapoor", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Pam", "Halpert", 6, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Meredith", "Palmer", 7, null);



