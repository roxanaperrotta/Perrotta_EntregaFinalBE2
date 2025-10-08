import express from "express";

import Product from "../config/model/product.model.js";

const router = express.Router();


router.post("/products", async (req, res) => {
  
    try {
        const {title, description, price, stock } = req.body;
        if(!title || !description || price || stock){
        res.status(400).json({ error: "Todos los datos son requeridos" });

        const newProduct = new Product({ title, description, price, stock });
        await newProduct.save();

    res.status(201).json({ "message": "Producto creado con exito.!", "product": newProduct });
     
    } }catch (error) {
        console.error("Error al crear producto nuevo", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

    
});

router.get('/products', async (req, res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({ "products": products })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



export default router;