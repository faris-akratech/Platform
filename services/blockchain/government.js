import axios from "axios";

export const register_dids_government = async (email, steward) => {
  try {
    const data = {
      name: email,
      wallet_config: `${email}_wallet`,
      wallet_credentials: `${email}_credential`,
      role: "TRUST_ANCHOR",
      steward,
    };
    const response = await axios.post(
      `${process.env.INDY_SERVER}/register_dids_government`,
      data
    );
    if (response.data.status_code === 200) {
      const output = JSON.parse(response.data.detail);
      return output;
    } else {
      console.error(
        "Error registering government on ledger",
        response.status,
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error registering government on ledger", err);
    return null;
  }
};
