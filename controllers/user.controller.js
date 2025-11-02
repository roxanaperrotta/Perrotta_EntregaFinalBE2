import mongoose from "mongoose";
import { UserService} from "../services/user.service.js";
import { toCreateUserDTO, toUpdateUserDTO } from "../models/dto/user.dto.js"

const svc = new UserService();

export const userController = {
  list: async (_req, res, next) => {
    try {
      res.json(await svc.list());
    } catch (e) {
      next(e);
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ error: "ID inválido" });
      const doc = await svc.getById(id);
      return doc
        ? res.json(doc)
        : res.status(404).json({ error: "El usuario no existe" });
    } catch (e) {
      next(e);
    }
  },

  create: async (req, res, next) => {
    try {
      const dto = toCreateUserDTO(req.body);
      const created = await svc.create(dto);
      res.status(201).json({ user: created });
    } catch (e) {
      next(e);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ error: "ID inválido" });
      const dto = toUpdateUserDTO(req.body);
      const out = await svc.update(id, dto);
      return out
        ? res.json(out)
        : res.status(404).json({ error: "El usuario no existe" });
    } catch (e) {
      next(e);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ error: "ID inválido" });
      const ok = await svc.delete(id);
      return ok
        ? res.status(204).end()
        : res.status(404).json({ error: "El usuario no existe" });
    } catch (e) {
      next(e);
    }
  },
};