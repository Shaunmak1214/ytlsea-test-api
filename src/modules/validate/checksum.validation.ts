import { NextFunction, Request, Response } from 'express';
import YtlCrypto from '../utils/checksum';
import { logger } from '../logger';

function checksumMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // if request is coming from postman or similar, skip checksum validation
    logger.info(JSON.stringify(req.headers));
    if (req.headers['postman-token']) {
      return next();
    }

    const { checksum, ...transactionData } = req.body;

    if (!checksum) {
      return res.status(400).json({ error: 'Checksum is missing' });
    }

    const generatedChecksum = YtlCrypto.generateChecksum(transactionData);

    if (generatedChecksum !== checksum) {
      return res.status(400).json({ error: 'Invalid checksum. Data may have been tampered with.' });
    }

    // If checksum is valid, proceed to the next middleware or route handler
    return next();
  };
}

export default checksumMiddleware;
