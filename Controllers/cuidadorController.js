import Cuidador from '../models/CuidadorSchema.js';
import ReservaSchema from '../models/ReservaSchema.js';

export const updateCuidador = async (req, res) => {
    const id = req.params.id;

    try{

        const updateCuidador = await Cuidador.findByIdAndUpdate(id, {$set: req.body}, {new:true});

        res.status(200).json({success:true, message: "Atualização feita com sucesso", data:updateCuidador});

    }catch (err) {

        res.status(500).json({success:false, message: "Atualização falhou"});

    }
};

export const deleteCuidador = async (req, res) => {
    const id = req.params.id;

    try{

        await Cuidador.findByDelete(id,);

        res.status(200).json({success:true, message: "Deletado com sucesso"});

    }catch (err) {

        res.status(500).json({success:false, message: "Falha ao deletar"});

    }
};

export const getSingleCuidador = async (req, res) => {
    const id = req.params.id;

    try{

        const cuidador = await Cuidador.findById(id)
        .populate("avaliacoes")
        .select('-password');

        res.status(200).json({success:true, message: "Cuidador encontrado", data:cuidador});

    }catch (err) {

        res.status(404).json({success:false, message: "Cuidador não encontrado"});

    }
};

export const getAllCuidador = async (req, res) => {



    try{

        const {query} = req.query
        let cuidadores;

        if (query){
            cuidadores = await Cuidador.find({
                isApproved: "approved",
                $or:[{name:{$regex:query, $options: "i" } },
                { specialization: { $regex: query, $options: "i"} },
            ],
            }).select("-password");
        } else{
            cuidadores = await Cuidador.find({ isApproved: /approved/i }).select("-password");
        }

        res.status(200).json({
            success:true,
            message: "Cuidadores encontrados",
            data:cuidadores});

    }catch (err) {

        res.status(404).json({success:false, message: "Cuidadores não encontrados"});

    }
};

export const getCuidadorProfile = async(req, res) => {
    const cuidadorId = req.userId

    try {
        const cuidador = await Cuidador.findById(cuidadorId);

        if(!cuidador){
            return res.status(404).json({success:false, message: "Cuidador não encontrado"})
        }

        const {password, ...rest} = cuidador._doc
        const consultas = await Reserva.find({cuidador:cuidadorId})

        res.status(200).json({success:true, message: "Informações do Perfil obtidas", data:{...rest, consultas}});


    } catch (err) {
        res.status(500).json({success:false, message: "Algo deu errado"});
    }
}