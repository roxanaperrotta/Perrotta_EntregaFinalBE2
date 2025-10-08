import express from "express";

import Cart from "../config/models/cart.model.js";

const router = express.Router();


router.post("/cart", async (req, res) => {
  
    try {
        const {product, quantity} = req.body;
        if(!product || !quantity){
        res.status(400).json({ error: "Todos los datos son requeridos" });

        const cart = new Cart({ product, quantity });
        await cart.save();

    res.status(201).json({ "message": "Carrito creado con exito.!", "cart": cart });
     
    } }catch (error) {
        console.error("Error al crear carrito nuevo", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

    
});

router.get('/cart', async (req, res)=>{
    try {
        const cart = await Cart.find();
        res.status(200).json({ "cart": cart })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



export default router;