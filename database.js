const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://root:root@cluster0.jfdw2ki.mongodb.net/?retryWrites=true&w=majority"

async function insertNewUser(roll_number,password) {
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const student = database.collection('users');

        // Creating a doc to insert
        const doc = {
            "roll_number" : roll_number.toLowerCase(),
            "password": password,
        };

        const result = await student.insertOne(doc);
    }
    finally{
        await client.close();
    }
}
module.exports.insertNewUser = insertNewUser;

async function insertNewForm(course,date) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const student = database.collection('forms');
        await student.createIndex( { "expDate": 1 }, { expireAfterSeconds: 0 } )

        var classDate  = new Date(date);
        var expDate = new Date();
        expDate.setDate(classDate.getDate()+1);

        // Creating a doc to insert
        const doc = {
            "createdAt": expDate,
            "id" :`${Math.floor(Math.random()* 10000000000)}`,
            "course" : course,
            "date": date,
            "day" : weekday[classDate.getDay()],
            "responded": [],
            "cancel": [],
            "noChange": [],
            "massBunk": [],
            "reschedule": []
        };

        const result = await student.insertOne(doc);
    }
    finally{
        await client.close();
    }
}
module.exports.insertNewForm = insertNewForm;

async function findUserByEmail(roll_number) {
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const student = database.collection('users');

        const query = { "roll_number": roll_number };
        const result = await student.findOne(query);
        return result;
    }
    finally{
        await client.close();
    }
}
module.exports.findUserByEmail = findUserByEmail;

async function fetchAllForms() {
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const student = database.collection('forms');
        const result = await student.find();
        return result.toArray();
    }
    finally{
        await client.close();
    }
}

module.exports.fetchAllForms = fetchAllForms;

async function findFormById(id) {
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const student = database.collection('forms');
        const query = { "id": id };
        const result = await student.findOne(query);
        return result;
    }
    finally{
        await client.close();
    }
}

module.exports.findFormById = findFormById;

async function updateForm(choice,roll_number,fid) {
    const client = new MongoClient(uri);
    const database = client.db('voting_system');
    try{
        const forms = database.collection("forms");
        const filter = { id: fid };
        var doc;
        if (choice==="cancel"){
            doc = {
                "responded": roll_number,
                "cancel" : roll_number
            }
        }
        if (choice==="reschedule"){
            doc = {
                "responded": roll_number,
                "reschedule" : roll_number
            }
        }
        if (choice==="noChange"){
            doc = {
                "responded": roll_number,
                "noChange" : roll_number
            }
        }
        if (choice==="massBunk"){
            doc = {
                "responded": roll_number,
                "massBunk" : roll_number
            }
        }
        const updateDoc = {
            $push: doc
          };
        const result = await forms.updateOne(filter, updateDoc);
        return result;
    }
    finally{
        await client.close();
    }
}

module.exports.updateForm = updateForm;

