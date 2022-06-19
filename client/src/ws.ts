import socketIOClient from "socket.io-client";

const WS = "ec2-18-193-123-110.eu-central-1.compute.amazonaws.com:8080";
export const ws = socketIOClient(WS);
