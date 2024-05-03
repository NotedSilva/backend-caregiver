import Avaliacao from '../models/AvaliacaoSchema.js'
import Cuidador from '../models/CuidadorSchema.js'

//obter todas as avaliações
export const getAllAvaliacoes = async (req, res) => {

    try{
        const avaliacoes = await Avaliacao.find({})

        res.status(200).json({success:true, message: "Bem-sucedido", data:avaliacoes})
    } catch(err){
        res.status(404).json({success:false, message: "Não encontrado" })
    }
}

//criar review
export const createAvaliacao = async (req, res) => {

    if(!req.body.cuidador) req.body.cuidador = req.params.cuidadorId
    if(!req.body.user) req.body.user = req.params.userId

    const newAvaliacao = new Avaliacao(req.body)

    try{
        const savedAvaliacao = await newAvaliacao.save()

        await Cuidador.findByIdAndUpdate(req.body.cuidador, {
            $push:{avaliacoes: savedAvaliacao._id}
        })

        res.status(200).json({success:true, message:"Avaliação enviada", data:savedAvaliacao})

    } catch (err) {
        res.status(500).json({success:false, message: err.message})
    }
}