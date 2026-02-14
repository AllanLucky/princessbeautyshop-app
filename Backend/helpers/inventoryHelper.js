import Inventory from "../models/inventoryModel.js";

/**
 * Deduct stock after an order is placed
 * @param {ObjectId} productId 
 * @param {Number} quantity 
 */
export const deductStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  if (!inventory) throw new Error("Inventory record not found");

  if (inventory.quantity < quantity) {
    throw new Error("Insufficient stock for this product");
  }

  inventory.quantity -= quantity;
  await inventory.save();
  return inventory;
};

/**
 * Increase stock (e.g., order cancelled or restocked)
 * @param {ObjectId} productId 
 * @param {Number} quantity 
 */
export const addStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  if (!inventory) throw new Error("Inventory record not found");

  inventory.quantity += quantity;
  await inventory.save();
  return inventory;
};

/**
 * Create inventory record for a product (if not exists)
 * @param {ObjectId} productId 
 * @param {Number} initialQty 
 */
export const createInventory = async (productId, initialQty = 0) => {
  const exists = await Inventory.findOne({ product: productId });
  if (exists) return exists;

  const inventory = await Inventory.create({ product: productId, quantity: initialQty });
  return inventory;
};
