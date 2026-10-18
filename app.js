// Task1: initiate app and run server at 3000

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((err) => {
        console.error("MongoDB Connection Failed:", err.message);
    });


const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);



//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching employees",
            error: error.message
        });
    }
});




//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({
            message: "Error fetching employee",
            error: error.message
        });
    }
});





//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();

        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({
            message: "Error adding employee",
            error: error.message
        });
    }
});






//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting employee",
            error: error.message
        });
    }
});





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({
            message: "Error updating employee",
            error: error.message
        });
    }
});

app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, id, ...updates } = req.body;
        const employeeId = _id || id;

        if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
            return res.status(400).json({
                message: "Valid employee ID is required"
            });
        }

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            updates,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({
            message: "Error updating employee",
            error: error.message
        });
    }
});







//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});



