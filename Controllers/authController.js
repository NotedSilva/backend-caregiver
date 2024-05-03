import User from '../models/UsuarioSchema.js';
import Cuidador from '../models/CuidadorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    })
}


export const register = async (req, res) => {

    const {email, password, name, role, photo, gender} = req.body


    try {
        let user = null

        if(role==='usuario'){
            user = await User.findOne({email})
        }
        else if(role==='cuidador'){
            user = await Cuidador.findOne({email})
        }

        // checar se o usuário existe
        if(user){
            return res.status(400).json({message: 'Usuário existente'})
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        if(role==='usuario'){
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }
        
        if(role==='cuidador'){
            user = new Cuidador({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()

        res.status(200).json({success: true, message:'Usuário criado com sucesso'})



    } catch (err) {
        res.status(500).json({success: false, message:'Erro na criação do usuário, tente novamente!'})
    }
};

export const login = async (req, res) => {

    const {email} = req.body

    try {

        let user = null

        const usuario = await User.findOne({email})
        const cuidador = await Cuidador.findOne({email})

        if(usuario){
            user = usuario
        }
        if(cuidador){
            user = cuidador
        }

        // checar se o usuário existe ou não

        if(!user){
            return res.status(404).json({message: "Usuário não encontrado"});
        }

        // comparativo de senhas

        const isPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password);

        if(!isPasswordMatch){
            return res.status(400).json({ status:false, message: "Credenciais inválidas"});
        }

        // gerar token

        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc

        res
            .status(200)
            .json({ status:true, message: "Conectado com sucesso", token, data:{...rest}, role});

    } catch (err) {
        res
            .status(500)
            .json({ status:false, message: "Falha ao conectar-se"});
    }
};

