import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const createWallet = async (email) => {
  try {
    const data = {
      name: email,
      // seed: "000000000000000000000000Steward1",
      seed: uuidv4().replace(/-/g, ''),
      wallet_config: `${email}_user_wallet`,
      wallet_credentials: `${email}_user_credential`,
    };

    const response = await axios.post(
      `${process.env.INDY_SERVER}/create_wallet`,
      data
    );
    if (response.data.status_code === 200 && response.status === 200) {
      const walletDetails = response.data.detail;
      return walletDetails;
    } else {
      console.error(
        "Error creating wallet on ledger",
        response.status,
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error creating wallet", err);
    return null;
  }
};
