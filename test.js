import { decryptPassword } from "./authentication/middlewares/password.js";

const testEncryptedPassword = "U2FsdGVkX19kLM+999GCZlneVjyIOS0RLaEgLBcKvvg=";
const testIV = "d63b382a7b625f939c48a765843c4b01";

const decryptedTestPassword = decryptPassword(testEncryptedPassword, testIV);
console.log(decryptedTestPassword);