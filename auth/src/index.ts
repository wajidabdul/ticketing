import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {

    // For k8s env variables
    // if (!process.env.JWT_KEY) {
    //     throw new Error('JWT_KEY must be defined');
    // }
    // if (!process.env.MONGO_URI) {
    //     throw new Error('MONGO_URI must be defined');
    // }

    try {
        // For k8s process.env.MONGO_URI use this connection URI
        await mongoose.connect('mongodb+srv://microticketing:ticketing@cluster0.aflw6.mongodb.net/micro-ticketing-auth?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to DB');
    } catch (err) {
        console.error(err);
    }

    app.listen(3001, () => {
        console.log('Listening on port 3001!');
    });
};

start();