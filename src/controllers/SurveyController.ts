import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'

class SurveyController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body

        const schema = yup.object().shape({
            title: yup.string().required(),
            description: yup.string().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false })            

            const surveyRepository = getCustomRepository(SurveysRepository)

            const survey = surveyRepository.create({
                title,
                description
            })

            await surveyRepository.save(survey)

            return response.status(201).json(survey)
        } catch (error) {
            throw new AppError(error)
        }
    }


    async index(request: Request, response: Response) {
        try {
            const surveyRepository = getCustomRepository(SurveysRepository)

            const surveys = await surveyRepository.find()

            return response.json(surveys)
        } catch (error) {
            throw new AppError(error)
        }
    }

}

export { SurveyController }