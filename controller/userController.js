// To declare
//db and schema
/* const User = require("../db/type/user"); */
const User = require("../db/schema/user");
const database = require("../db/connexion");

const bcrypt = require("bcrypt");

async function register(req, res) {
  const user = new User(req.body);

  try {
    await user.save();
    //envoyer l'email de confirmation de création de compte
    const token = await user.generateAuthToken();
    const { password, ...useWithoutPassword } = user._doc;
    res.status(200).send({ user: useWithoutPassword, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
}

async function logIn(req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    const { password, ...useWithoutPassword } = user._doc;
    res.send({ user: useWithoutPassword, token });
  } catch (e) {
    res.status(400).send(e);
  }
}

async function logOut(req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
}

async function myInfo(req, res) {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("This is a wrong id");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send("This is a wrong id");
  }
}

async function reconnectUser(req, res) {
  const token = req.body.token;
  const user = await User.findByToken(token);

  if (!user) {
    return res.status(404).send("This is a wrong token");
  }

  const token2 = await user.generateAuthToken();
  const { password, ...useWithoutPassword } = user._doc;
  res.send({ user: useWithoutPassword, token: token2 });
}

async function updateInfo(req, res) {
  const allowedUpdates = ["name", "email", "password"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid Upadates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
}

async function deleteUser(req, res) {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
}

async function index(req, res) {
  try {
    const users = await User.find(req.params.id);

    if (!users) {
      return res.status(202).send("There is no user ");
    }
    const userWithoutTokAndPswd = users.map((user) => {
      const { password, tokens, ...rest } = user._doc;
      return rest;
    });
    res.status(200).send(userWithoutTokAndPswd);
  } catch (error) {
    res.status(404).send("This is error: " + error);
  }
}
// Function
/* async function registerUser(req, res) {
    if (!req.body.mail || !req.body.firstname || !req.body.lastname || !req.body.address || !req.body.city || !req.body.zip || !req.body.mobile || !req.body.password) {
        return res.status(400).json({
            status: "Veuillez remplir completement le formulaire d'inscription",
        });
    }
 
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.password, salt);
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    //const ip = req.headers["x-forwarded-for"].split(',')[0] || req.connection.remoteAddress;
 
    if (await isUserExist.byMail(req.body.mail)) {
        return res.status(400).json({
            status: "Votre adresse mail est déjà utiliser",
        });
    }
 
    newUser = new UserShema(new User(req.body.mail, req.body.firstname, req.body.lastname, req.body.address, req.body.city, req.body.zip, password, req.body.mobile, ip));
 
    newUser.save((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(400);
        } else {
            return updateUser(data._id, randKey.generate(250), res);
        }
    });
} */

module.exports = {
  index,
  register,
  logIn,
  logOut,
  myInfo,
  updateInfo,
  reconnectUser,
};
