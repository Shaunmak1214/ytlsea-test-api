import crypto from 'crypto';

const generateChecksum = (data: any) => {
  const secretKey = process.env['CHECKSUM_KEY'] || undefined;

  if (!secretKey) {
    throw new Error('CHECKSUM_KEY is not set');
  }

  const stringData = JSON.stringify(data);
  return crypto.createHmac('sha256', secretKey).update(stringData).digest('hex');
};

const verifyChecksum = (receivedData: any, receivedChecksum: any) => {
  const checksum = generateChecksum(receivedData);
  return checksum === receivedChecksum;
};

const YtlCrypto = {
  generateChecksum,
  verifyChecksum,
};

export default YtlCrypto;
