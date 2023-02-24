import { client } from "../index.js";

export async function CreateUsers(data) {
    return await client.db("Pizzas").collection("users").insertOne(data);
}

export async function getUserByName(username) {
    return await client.db("Pizzas").collection("users").findOne({ username: username });
}
export async function getUserByEmail(email) {
    return await client.db('Pizzas').collection('users').findOne({email:email});
}