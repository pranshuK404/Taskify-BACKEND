import crypto from "crypto";

//----Token Generation Function----

const generateToken = (expiryInMinutes = 10) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const tokenExpiry = Date.now() + expiryInMinutes * 60 * 1000;

  return {
    rawToken,
    hashedToken,
    tokenExpiry,
  };
};

// ----Hashing a token for comparison----
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
}


export const cryptoTokenUtils = {
  generateToken,
  hashToken
};
