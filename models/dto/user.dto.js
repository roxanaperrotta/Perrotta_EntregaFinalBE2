export function toCreateUserDTO(body){
    const {first_name, last_name, email} = body ?? {}
    if (!first_name || !last_name || !email){
        throw new Error('Payload Incorrecto!')
    }

    return {first_name, last_name, email};

};

export function toUpdateUserDTO(body){
    const out = {};
    if (body.first_name) out.name = body.first_name;
    if (body.last_name) out.last_name = body.last_name;
    if (body.email) out.email = body.email;
    return out;

}