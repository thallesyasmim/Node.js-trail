import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'

class SurveyController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body
        try {

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
            console.error(error)
            return response.json(error)
        }
    }

}

export { SurveyController }