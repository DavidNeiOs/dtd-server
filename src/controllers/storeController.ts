import { RequestHandler } from "express";
import Store  from "../schemas/Store"

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

export const editStore: RequestHandler = async (req, res) => {
  // find store with the id
  const store = await Store.findOne({ _id: req.params.id });
  // TODO: confirm the owner of the store
  // send back the data for the form to use
  res.json(store)
}

export const updateStore: RequestHandler = async (req, res) => {
  // find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of old one
    runValidators: true
  }).exec()
  // redirect them and tell them it worked

  res.send({ success: true, message: `Succesfully updated ${store?.name}`})
}

export const getStoreBySlug: RequestHandler = async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug });
  res.json(store);
}


export const getStoresByTag: RequestHandler = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true }

  const tagsPromise = Store.getTagsList()
  const storesPromise = Store.find({ tags: tagQuery})

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  res.json({tags, stores})
}