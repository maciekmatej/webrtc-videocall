import dotenv from 'dotenv';
dotenv.config();
export default {
    PEER_PORT: process.env.PEER_PORT || 9000,
    PORT: process.env.PORT || 5000,
};
