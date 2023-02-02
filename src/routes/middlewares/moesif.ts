import moesif from "moesif-nodejs";

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,
});

moesifMiddleware.startCaptureOutgoing();

export default moesifMiddleware;
