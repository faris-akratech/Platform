import axios from "axios";

export const createWallet = async (email) => {
    try {
      const data = {
        name: email,
        seed: "000000000000000000000000Steward1",
        wallet_config: `${email}_wallet`,
        wallet_credentials: `${email}_credential`,
      };
  
      const response = await axios.post(`${process.env.INDY_SERVER}/create_wallet`, data);
      if (response.data.status_code === 200) {
        const walletDetails = JSON.parse(response.data.detail);
        return walletDetails;
      } else {
        console.error("Error creating wallet on ledger", response.status, response.data);
        return null;
      }
    } catch (err) {
      console.error("Error creating wallet", err);
      return null;
    }
  };