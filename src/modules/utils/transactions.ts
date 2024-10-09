import payNetResCodes from '../../config/error_codes';

export const generateTransactionId = (type: string): string => {
  // Generate a random 10-digit number
  const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000);
  // Get the current Unix timestamp
  const unixTime = Math.floor(Date.now() / 1000);

  // Determine the prefix based on the type
  let prefix = '';
  if (type === 'transfer') {
    prefix = `trx-${randomNumbers}-t-${unixTime}`;
  } else if (type === 'reload') {
    prefix = `rel-${randomNumbers}-t-${unixTime}`;
  } else {
    throw new Error("Invalid transaction type. Use 'transfer' or 'reload'.");
  }

  return prefix;
};

export const generateAccountToken = (): string => {
  // Generate a random 10-digit number
  const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000);
  // Get the current Unix timestamp
  const unixTime = Math.floor(Date.now() / 1000);

  return `acct-${randomNumbers}-t-${unixTime}`;
};

export const randomErrorCode = (probability: number): string => {
  const errorCodes = Object.keys(payNetResCodes) as Array<keyof typeof payNetResCodes>;
  const randomIndex = Math.floor(Math.random() * errorCodes.length);
  const randomCode = errorCodes[randomIndex];

  const failureThreshold = probability / 100;

  if (randomCode && Math.random() < failureThreshold) {
    return payNetResCodes?.[randomCode];
  }

  return payNetResCodes['00'];
};
