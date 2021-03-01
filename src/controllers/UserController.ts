import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        if(!(await schema.isValid(request.body))) {
            return response.status(400).json({
                error: 'Validation Failed'
            })
        }

        try {

            const userRepository = getCustomRepository(UsersRepository)

            const userAlreadyExists = await userRepository.findOne({ email })

            if(userAlreadyExists) {
                return response.status(400).json({
                    error: 'User already exists!'
                })
            }

            const user = userRepository.create({
                name,
                email
            })

            await userRepository.save(user)

            return response.status(201).json(user)


        } catch (error) {
            console.error(error)
            return response.json(error)
        }
    }
}

export { UserController }