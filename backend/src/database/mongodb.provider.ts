import { Config } from '../config';
import mongoose, { ConnectOptions } from 'mongoose';

const mongoOptions: ConnectOptions = {
    authSource: 'admin',
  };

const MongoConnection = async ()=> {
    try {
        const mongo = await mongoose.connect('mongodb+srv://investloupt:InvestLoupt123@loupt.ceqpoc4.mongodb.net/loupt?retryWrites=true&w=majority', mongoOptions)
        console.log(`mongodb connected successfully: ${mongo.connection.host}`)
        return mongo
    } catch (e) {
        console.log(`mongodb unable to connect\n${e}`)
    }
}

export default MongoConnection;