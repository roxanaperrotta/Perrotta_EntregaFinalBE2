import {UserRepository as usr} from '../repository/user.repository.js'

export class UserService{

    async list(){return usr.find()};
    async getById(id){return usr.findById(id)};
    async create(dto){return usr.create(dto)};
    async update(id, dto){return usr.findByIdAndUpdate(id, dto, {new: true})};
    async delete(id){ return !!(await usr.findByIdAndDelete(id))}

}