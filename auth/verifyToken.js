import jwt from 'jsonwebtoken'
import Cuidador from '../models/CuidadorSchema.js'
import User from '../models/UsuarioSchema.js'

export const authenticate = async (req, res, next) => {

    // obter token
    const authToken = req.headers.authorization

    // checar se o token existe
    if(!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({sucess: false, message: 'Sem token, autorização negada'})
    }

    try {
        const token = authToken.split(" ")[1];

        //verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decoded.id
        req.role = decoded.role

        next(); 
    } catch (err) {

        if(err.name ==="TokenExpiredError"){
            return res.status(401).json({message: "O Token expirou"});
        }

        return res.status(401).json({sucess:false, message: "Token inválido"});
    }
};

export const restrict = roles=> async (req, res, next) => {
    const userId = req.userId

    let user;

    const usuario = await User.findById(userId)
    const cuidador = await Cuidador.findById(userId)

    if(usuario){
        user = usuario
    }
    if(cuidador){
        user = cuidador
    }

    if(!roles.includes(user.role)){
        return res.status(401).json({sucess:false, message: "Você não foi autorizado"})
    }

    next();
};