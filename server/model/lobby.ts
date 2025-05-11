import { LobbyEvent } from "@repo/share/types";
import * as proto from "./proto.ts";

export namespace lobby {
  export function notify(message: LobbyEvent, id?: string) {
    if (!id) {
      proto.post("lobby", message);
    } else {
      proto.post(`lobby:${id}`, message);
    }
  }

  export function listen(id: string, onMessage: (message: LobbyEvent) => void) {
    const unsubGlobal = proto.listen("lobby", LobbyEvent, onMessage);
    const unsubPersonal = proto.listen(`lobby:${id}`, LobbyEvent, onMessage);

    return () => {
      unsubGlobal();
      unsubPersonal();
    };
  }
}
