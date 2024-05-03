import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    // enum: ["patient", "admin", "usuario"],
    // default: "usuario",
  },
  gender: { type: String, enum: ["homem", "mulher", "outros"] },
  idade: { type: Number },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

export default mongoose.model("Usuario", UsuarioSchema);