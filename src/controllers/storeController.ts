import { RequestHandler } from "express";
import mongoose from "mongoose";

const Store = mongoose.model('Store');

export const homePage: RequestHandler = (req, res) => {
  res.send({data: "Hello from Controller"})
}

export const addStore: RequestHandler = (req, res) => {

}

export const createStore: RequestHandler = async (req, res) => {
  const store = new Store(req.body)
  const response = await store.save();
}