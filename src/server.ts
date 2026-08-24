/* eslint-disable no-console */
import {Server} from 'http';
import mongoose from 'mongoose';
import { envConfig } from './app/config/env';
import app from './app';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';


let server: Server;

const startServer = async() => {
    try{
        console.log(envConfig.NODE_ENV)
        await mongoose.connect(envConfig.DB_URL);
        console.log("Connected to mongoDB");
        server = app.listen(envConfig.PORT, ()=> {
            console.log(`Server is running on port ${envConfig.PORT}`);
        })
    }catch(error){
        console.log("Error connecting to mongoDB", error);
    }
}

(async()=>{
    startServer();
seedSuperAdmin();
})()

// error handlers

// sigterm
process.on("SIGTERM", (error)=>{
    console.log("SIGTERM signal received", error);
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})

// sigint
process.on("SIGINT", (error)=>{
    console.log("SIGINT signal received", error);
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})
// unhandled promise rejections
process.on("unhandledRejection",(error)=>{
    console.log("Unhandled Rejection", error);
    if(server){
        server.close();
        process.exit(1);
    }
} )

// uncaught exceptions 
process.on("uncaughtException", (error)=>{
    console.log("Unhandled Exception", error);
    if(server){
        server.close();
        process.exit(1);
    }
})




