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
    console.log(choice,roll_number,fid);
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
        console.log(doc);
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