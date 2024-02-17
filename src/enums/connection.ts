export enum EAmqQueues {
  Gateway = 'gatewayQueue',
  Fights = 'fightsQueue',
}

export enum EServices {
  Gateway = 'gateway',
  Fights = 'fights',
}

export enum EMessageTypes {
  Error = 'error',
  Credentials = 'credentials',
  Send = 'send',
  Heartbeat = 'heartbeat',
}
