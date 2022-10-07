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