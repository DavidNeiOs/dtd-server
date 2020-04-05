import { RequestHandler } from "express";
import { model } from "mongoose";
import { StoreModel } from "../schemas/Store"

const Store: StoreModel = model('Store');

export const homePage: RequestHandler = (req, res) => {
  res.send({data: "Hello from Controller"})
}

export const addStore: RequestHandler = (req, res) => {

}

export const createStore: RequestHandler = async (req, res) => {
  const store = await (new Store(req.body)).save()

  res.send({ success: true, message: `Store ${store.name} created successfully`, slug: store.slug})
}