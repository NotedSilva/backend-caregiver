import  express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import cuidadorRoute from './Routes/cuidador.js';
import avaliacaoRoute from './Routes/avaliacao.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin:true,
};

app.get('/', (req, res) => {
    res.send("API ESTA FUNCIONANDO");
});

// conexão database
mongoose.set('strictQuery', false);
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);

        console.log('MongoDB database esta conectado')

    } catch(err) {
        console.log('MongoDB database conexao falhou')
    }
}

//intermediário
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/usuarios", userRoute);
app.use("/api/v1/cuidadores", cuidadorRoute);
app.use("/api/v1/avaliacoes", avaliacaoRoute);



app.listen(port, () =>{
    connectDB();
    console.log("Server esta rodando na porta" + port);
});