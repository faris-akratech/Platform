import jwt from "jsonwebtoken";
import {
  checkUserExist,
  createUser,
  createUsername,
  updateUserInfo,
  verifyUser,
} from "./middlewares/user.db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendEmailForVerification } from "./middlewares/sendgrid.js";
import { createWallet } from "../services/blockchain/wallet.js";

export const sendVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is empty" });
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await checkUserExist(email);
    if (user && user.isEmailVerified) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (user) {
      return res
        .status(409)
        .json({ message: "Verification mail already sent" });
    }
    const verifyCode = uuidv4();
    const uniqueUsername = createUsername(email, verifyCode);
    const sendMail = await sendEmailForVerification(email, verifyCode);
    if (sendMail) {
      await createUser(email, verifyCode, uniqueUsername);
      return res
        .status(200)
        .json({ message: "Verification mail sent", data: verifyCode });
    } else
      return res
        .status(424)
        .json({ message: "Could not send verification mail" });
  } catch (err) {
    console.error("Error while sending verification mail", err);
    return res
      .status(500)
      .json({ error: "Error while sending verification mail" });
  }
};

export const verifyMail = async (req, res) => {
  try {
    const { email, verificationCode } = req.query;
    if (!email || !verificationCode) {
      return res
        .status(404)
        .json({ message: "Email or verification code is empty or invalid" });
    }
    const user = await checkUserExist(email);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    if (user.isEmailVerified) {
      return res.status(409).json({ message: "User already verified" });
    }
    if (user.verificationCode !== verificationCode.slice(0, -1)) {
      return res
        .status(406)
        .json({ message: "Verification codes does not match" });
    }
    await verifyUser(email);
    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("Error while verifiying mail");
    return res.status(500).json({ error: "Error while verifiying mail" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    if (!email || !firstName || !lastName || !password) {
      return res
        .status(404)
        .json({ message: "Some or all of the fields are empty" });
    }
    const user = await checkUserExist(email);
    if (!user) {
      return res.status(404).json({ message: "No user with given mail" });
    }
    if (!user.isEmailVerified) {
      return res.status(409).json({ message: "User is not verified" });
    }
    if (user.password) {
      return res
        .status(409)
        .json({ message: "User details are already added" });
    }
    if (password.length < 7) {
      return res
        .status(401)
        .json({ message: "Password length requirnment not met" });
    }
    const hash = await bcrypt.hash(password, 10);
    const userInfo = { firstName, lastName, password: hash };
    const walletDetails = await createWallet(email); // Add this function to create wallet details
    if (!walletDetails) {
      return res.status(500).json({ message: "Error creating wallet details" });
    }
    console.log(walletDetails);
    // await updateUserInfo(email, userInfo, walletDetails);
    return res.status(210).json({ message: "User created successfully" });
    // User is the government
    // const data = { name: email, seed: "000000000000000000000000Steward1", wallet_config: `${email}_wallet`, wallet_credentials: `${email}_credential` };
    // const response = await axios.post(`${process.env.INDY_SERVER}/create_wallet`, data);
    // console.log(response.data, 'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    // if (response.data.status_code === 200) {
    //   return res.status(410).json({ message: "User created successfully" });
    //   data.steward = JSON.parse(response.data.detail);
    //   const create_gov = await axios.post(`${process.env.INDY_SERVER}/register_dids_government`, data)
    //   if(create_gov.status === 200) return res.status(410).json({ message: "User created successfully" });
    //   return res.status(response.status).json({ message: "Error" });
    // } else {
    //   return res.status(response.status).json({ message: "Error creating User(government) on ledger" });
    // }
    // return res.status(200).json({ message: "User registered succesfully" });
  } catch (err) {
    console.error("Error while signup", err);
    return res.status(500).json({ error: "Error while signing up" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email, password, or both are empty" });
    }

    const user = await checkUserExist(email);
    if (!user) {
      return res.status(404).json({ message: "No user with given email" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "User not verified" });
    }
    await bcrypt.compare(password, user.password, function (err, result) {
      if (err) return res.status(403).json({ message: "Incorrect password" });
      else if (result) {
        const access_token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "6h",
        });

        return res
          .status(200)
          .json({ message: "User logged in successfully", access_token });
      }
    });
  } catch (err) {
    console.error("Error in signin", err);
    return res.status(500).json({ error: "Error while signing in" });
  }
};
