import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import * as yup from 'yup'

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
            console.error(error)
            return response.json(error)
        }
    }


    async index(request: Request, response: Response) {
        try {
            const surveyRepository = getCustomRepository(SurveysRepository)

            const surveys = await surveyRepository.find()

            return response.json(surveys)
        } catch (error) {
            return response.status(400).json(error)
        }
    }

}

export { SurveyController }