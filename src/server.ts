import {Server} from 'http';
import mongoose from 'mongoose';
import { envConfig } from './app/config/env';
import app from './app';


let server: Server;

const startServer = async() => {
    try{
        await mongoose.connect(envConfig.DB_URL);
        console.log("Connected to mongoDB");
        server = app.listen(envConfig.PORT, ()=> {
            console.log(`Server is running on port ${envConfig.PORT}`);
        })
    }catch(error){
        console.log("Error connecting to mongoDB", error);
    }
}

startServer();