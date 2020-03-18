import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Product.findById(args.id)
    .lean()
    .exec()
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Product.find({})
    .lean()
    .exec()
}

const newProduct = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }
  return Product.findByIdAndUpdate(args.id, args.input, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    /* rootresolver so obj is empty */
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      /* createdBy: User */
      /* tree, 1st resolve product type => Product type as obj */
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
