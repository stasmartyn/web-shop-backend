const express = require("express");
const jwt = require("jsonwebtoken");
const { secret } = require("../authControler/config");
// add product operations
const controller = require("../authControler/index");
const { check } = require("express-validator");
// const multer = require("multer");
// MODELS
const { Product,User,Role,Cart } = require("../models");
const router = express.Router();
const authMiddleware = require("../authControler/authMiddleware");
const path = require("path");
const roleMiddleware = require("../authControler/roleMiddleware");
const authControler = require("..");

router.get("/phones", async (req, res, next) => {
  try {
    // add get all ()

    const getAll = await Product.find();
    if (getAll) {
      res.send(getAll);
    }
  } catch (error) {
    next(error);
  }
});

// manager get users list
router.get(
  "/auth/users",
  roleMiddleware(["MANAGER", "ADMIN"]),
  async (req, res, next) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

// manager get user cart
router.get("/auth/user/cart/:id", roleMiddleware(["MANAGER"]), async (req, res, next) => {
  try {
    const {id}=req.params;
    console.log(id)
    const userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      const error = new Error("User cart not Found");
      error.status = 404;
      throw error;
    }

    res.json(userCart);
  } catch (error) {
    next(error);
  }
});

// user get cart route
router.get("/auth/user/cart", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.user;

    console.log(id);
    const userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      const error = new Error("User cart not Found");
      error.status = 404;
      throw error;
    }

    res.json(userCart);
  } catch (error) {
    next(error);
  }
});

// manager get user products 
router.get("/user/product/cart", async (req, res) => {
  try {
    const{ids}=req.query;
    if (!ids) {
      const error = new Error("Missing product IDs");
      error.status = 400;
      throw error;
    }
    const products = await Product.find({ _id: { $in: ids } });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// const uploadDir = path.join(process.cwd(), "uploads");
// const storeImage = path.join(process.cwd(), "images");

// const multerConfig = multer.diskStorage({
//   destination: (req, file, cd) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   limist: {
//     fileSize: 2048,
//   },
// });

// const upload = multer({
//   storage: multerConfig,
// });

router.post("/newproduct", roleMiddleware(["ADMIN"]), async (req, res, next) => {
console.log(req)
  try {
    const newProduct = await Product.create(postData);
    res.status(201).json(`new product ${newProduct._id}`);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", roleMiddleware(["ADMIN"]), async (req, res, next) => {
  // add get by id
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndRemove(id);
    if (!product) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.json("product delete");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/auth/registration",
  [
    check("userName", "user name required").notEmpty(),
    check(
      "password",
      "password must be longer than 4 and less than 10 characters"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);

router.post("/auth/login", controller.login);

router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    res.json({ message: "Ви вийшли з системи" });
  } catch (error) {
    next(error);
  }
});

router.post("/addtocart/:productId", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { productId } = req.params;
    console.log(req.user)
    if (!token) {
      const error = new Error("User not register");
      error.status = 401;
      throw error;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }

    const userId =req.user.id ;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [product._id] });
    } else if (!cart.product.includes(product._id)) {
      cart.product.push(product._id);
    }
    await cart.save();
    res.json({ message: "done", cart });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteincart/:id", authMiddleware, async (req, res, next) => {
  // add get by id
  const { id } = req.params;

  try {
    const userId = req.user.id;
    const productCart = await Cart.findOne({ user: userId });
    const checkProduct = productCart.product.includes(id);
    if (!checkProduct) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    if (checkProduct) {
      productCart.product.pull(id);
      await productCart.save();
      res.json("product delete");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
