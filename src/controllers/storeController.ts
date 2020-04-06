import { RequestHandler } from "express";
import { model } from "mongoose";
import { StoreModel } from "../schemas/Store"

const Store: StoreModel = model('Store');


export const addStore: RequestHandler = (req, res) => {

}

export const createStore: RequestHandler = async (req, res) => {
  const store = await (new Store(req.body)).save()

  res.send({ success: true, message: `Store ${store.name} created successfully`, slug: store.slug})
}


export const getStores: RequestHandler = async (req, res) => {
  // query db for a list of all stores
  const stores = await Store.find();
  res.send({ success: true, stores })
}