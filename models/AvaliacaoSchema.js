import mongoose from "mongoose";
import Cuidador from "./CuidadorSchema.js";

const AvaliacaoSchema = new mongoose.Schema(
  {
    cuidador: {
      type: mongoose.Types.ObjectId,
      ref: "Cuidador",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

AvaliacaoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

AvaliacaoSchema.statics.calcAverageRatings = async function (cuidadorId) {

  const stats = await this.aggregate([{
    $match:{ cuidador: cuidadorId },
  },
  {
    $group: {
      _id: "$cuidador",
      numOfRating:{ $sum: 1 },
      avgRating:{ $avg: "$rating" },
    },
  },
]);

  await Cuidador.findByIdAndUpdate(cuidadorId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating,
  });
};

AvaliacaoSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.cuidador);
});

export default mongoose.model("Avaliacao", AvaliacaoSchema);