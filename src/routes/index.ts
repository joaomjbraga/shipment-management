import { Router, type Request, type Response} from 'express'

const route = Router()

route.get('/', (request: Request, response: Response)  => {

  return response.json({messagem: "rodando normal"})
})
