import { Router } from "express";
import { User } from "../config/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import environment from '../config/env.config.js';
import {
  requireJwtCookie,
} from "../middlewares/auth.middleware.js";
import Cart from "../config/models/cart.model.js";

const router = new Router();

//Registro local usando bcrypt

  router.post("/register", async (req, res) => {
  try {
    

    const { first_name, last_name, email, password, age } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Todos los datos son requeridos" });
    }
 
    const exist = await User.findOne({ email });
    if (exist)
      return res
        .status(400)
        .json({ error: "El mail ingresado ya se encuentra registrado" });

    const hash = await bcrypt.hash(password, 10);

    const newCart = new Cart({});
    await newCart.save();


    await User.create({ first_name, last_name, email, age, password: hash, cart: newCart._id});


    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//login con JWT

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email|| !password)
    return res.status(400).json({ error: "Faltan Credenciales" });
  const u = await User.findOne({ email });
  if (!u)
    return res.status(400).json({ error: "Credenciales Inválidas" });

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(400).json({ error: "Contraseña Inválida" });

  const payload = { sub: String(u._id), email: u.email, role: u.role };
  const token = jwt.sign(payload, environment.JWT_SECRET, { expiresIn: "1h" });

// Cookie httpOnly

res.cookie('access_token', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 60*60*1000,
  path:'/'
})

  res.json({ message: "LogIn Ok (JWT en cookie)"});
});



router.get('/current', requireJwtCookie,  async(req, res)=>{

    const user = await User.findById(req.user._id).lean();
    if(!user) return res.status(404).json({error:"Usuario no encontrado"});

    const {first_name, last_name, email, age, role} = user;
    res.json({ user: {first_name, last_name, email, age, role}});
});

router.post('/logout', (req, res)=>{
  res.clearCookie('access_token', {path: '/'});
  res.json({message:'Logout - Cookie de JWT borrada'})
})

export default router;
