// product Controller

const Product = require("../db/schema/product");
const db = require("../db/connexion");

async function index(req, res) {
    try {
        const listProducts = await Product.find();

        if (!listProducts) {
            return res.status(202).send("There is no Products");
        }
        res.status(200).send(listProducts);
    } catch (error) {
        res.status(404).send("This is error: " + error);
    }
}
async function getByProductId(req, res) {
    try {
        const product = await Product.findById(req.id);

        if (!product) {
            return res.status(202).send("There is no Product with this Id");
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send("This is error: " + error);
    }
}
async function addProduct(req, res) {
    try {
        const product = await Product.insertOne({
            name: req.name,
            stock: req.stock,
            cover: req.cover,
            price: req.price
        });
        if (!product) {
            return res.status(200).send("There is no Product with this Id");
        }
        res.status(200).send({ msg: "Product inserted", product });
    } catch (error) {
        res.status(404).send("This is error: " + error);
    }
}
async function updateProduct(req, res) {
    try {
        if (req.params.id) {
            const product = await Product.findByIdAndUpdate(req.params.id, ...req.body);
            if (!product) {
                return res.status(200).send("There is no Product with this Id");
            }
            res.status(200).send({ msg: "Product updated", product });
        }
    } catch (error) {
        res.status(404).send("This is error: " + error);
    }
}
async function deleteProduct(req, res) {
    try {
        if (req.params.id) {
            const product = await Product.deleteOne({
                _id: req.id
            });
            if (!product) {
                return res.status(200).send("There is no Product with this Id");
            }
            res.status(200).send({ msg: "Product deleted", product });
        }
    } catch (error) {
        res.status(404).send("This is error: " + error);
    }
}
module.exports = {
    index,
    getByProductId,
    addProduct,
    updateProduct,
    deleteProduct,
};