import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path'
import * as yup from 'yup'
import { AppError } from '../errors/AppError';

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const schema = yup.object().shape({
            email: yup.string().email().required(),
            survey_id: yup.string().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false })            

            const usersRepository = getCustomRepository(UsersRepository)
            const surveysRepository = getCustomRepository(SurveysRepository)
            const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

            const userAlreadyExists = await usersRepository.findOne({ email })

            if(!userAlreadyExists) {
                throw new AppError('User does not exists')
            }

            const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id })

            if(!surveyAlreadyExists) {
                return response.status(400).json({
                    error: 'Survey does not exists'
                })
            }

                       
            const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')


            const surveyUserAlreadyExits = await surveysUsersRepository.findOne({ 
                where: { 
                    user_id: userAlreadyExists.id,
                    survey_id: surveyAlreadyExists.id,
                    value: null 
                },
                relations: [
                    'user',
                    'survey'
                ]
            })


            const variables = {
                name: userAlreadyExists.name,
                title: surveyAlreadyExists.title,
                description: surveyAlreadyExists.description,
                id: '',
                link: process.env.URL_MAIL
            }

            if(surveyUserAlreadyExits) {
                variables.id = surveyUserAlreadyExits.id
                await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)
                return response.json(surveyUserAlreadyExits)
            }


            const surveyUser = surveysUsersRepository.create({
                user_id: userAlreadyExists.id,
                survey_id
            })

            variables.id = surveyUser.id

            await surveysUsersRepository.save(surveyUser)

            await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)

            return response.status(201).json(surveyUser)



        } catch (error) {
            throw new AppError(error)
        }
    }
}

export { SendMailController }