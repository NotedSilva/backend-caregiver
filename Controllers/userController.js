import User from '../models/UsuarioSchema.js';
import Booking from '../models/ReservaSchema.js';
import Cuidador from '../models/CuidadorSchema.js';

export const updateUser = async (req, res) => {
    const id = req.params.id;

    try{

        const updateUser = await User.findByIdAndUpdate(id, {$set: req.body}, {new:true});

        res.status(200).json({success:true, message: "Atualização feita com sucesso", data:updateUser});

    }catch (err) {

        res.status(500).json({success:false, message: "Atualização falhou"});

    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try{

        await User.findByDelete(id,);

        res.status(200).json({success:true, message: "Deletado com sucesso"});

    }catch (err) {

        res.status(500).json({success:false, message: "Falha ao deletar"});

    }
};

export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try{

        const user = await User.findById(id).select('-password');

        res.status(200).json({success:true, message: "Usuário encontrado", data:user});

    }catch (err) {

        res.status(404).json({success:false, message: "Usuário não encontrado"});

    }
};

export const getAllUser = async (req, res) => {

    try{

        const users = await User.find({}).select('-password');

        res.status(200).json({success:true, message: "Usuários encontrados", data:users});

    }catch (err) {

        res.status(404).json({success:false, message: "Usuários não encontrados"});

    }
};

export const getUserProfile = async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({success:false, message: "Usuário não encontrado"})
        }

        const {password, ...rest} = user._doc

        res.status(200).json({success:true, message: "Informações do Perfil obtidas", data:{...rest}});


    } catch (err) {
        res.status(500).json({success:false, message: "Algo deu errado"});
    }
};


export const getMyAppointments = async (req, res) => {
    try {
        
        // passo 1: recuperar as consultas da agenda por usuarios especificos 
        const bookings = await Booking.find({user:req.userId})
        // passo 2: extrair id dos cuidadores das consultas
        const cuidadorIds = bookings.map(el =>el.cuidador.id)
        // passo 3: recuperar cuidadores com id especificos
        const cuidadores = await Cuidador.find({_id: {$in:cuidadorIds}}).select("-password")

        res.status(200).json({success:true, message: "Consultas geradas com sucesso", data:cuidadores})

    } catch (err) {
        res.status(500).json({success:false, message: "Algo deu errado"});
    }
}