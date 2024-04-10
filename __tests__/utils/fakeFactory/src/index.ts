import FakeDetails from './details';
import FakeMessage from './message';
import FakeChat from './chat';

export default class FakeFactory {
  private readonly _message: FakeMessage;
  private readonly _messageDetails: FakeDetails;
  private readonly _chat: FakeChat;

  constructor() {
    this._message = new FakeMessage();
    this._messageDetails = new FakeDetails();
    this._chat = new FakeChat();
  }

  get messages(): FakeMessage {
    return this._message;
  }

  get messageDetails(): FakeDetails {
    return this._messageDetails;
  }

  get chat(): FakeChat {
    return this._chat;
  }

  async cleanUp(): Promise<void> {
    await this._message.cleanUp();
    await this._messageDetails.cleanUp();
    await this._chat.cleanUp();
  }
}
