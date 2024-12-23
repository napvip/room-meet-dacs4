import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose = { conn: null, promise: null };
}

//kết nối
async function dbConnect(){
    //check tồn tại kết nối
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            

            bufferCommands: false,
            serverSelectionTimeoutMS: 3000,
        };

        // tao ket noi moi va luu no vao cache
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default dbConnect;