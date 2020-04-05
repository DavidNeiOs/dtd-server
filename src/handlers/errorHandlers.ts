import {Request, Response, NextFunction, RequestHandler} from "express";
/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

type Fn = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<any>

export const catchErrors: Fn = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

export const handleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Error:", err.message)
  }
  res.status(err.status || 500);
  res.send({
    errors: {
      message: "There was an error getting the data, try again later"
    }
  })
}