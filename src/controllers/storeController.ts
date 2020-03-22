import {Request, Response} from "express";


export const homePage = (req: Request, res: Response) => {
  res.send({data: "Hello from Controller"})
}