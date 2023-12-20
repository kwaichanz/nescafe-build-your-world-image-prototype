import { type } from "os";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    chatMessage: (msg: string) => void;
    chatMessageToAll: (msg: string) => void;
    helloFromServer: (a: number, b: string, c: Buffer) => void;
    send_message: (msg: message) => void;
    join_room: (roomIdwwww: string, callback?: () => void) => void;
    users_response: (users: any) => void;
    receive_message: (msg: IMessage) => void;
    error_response: (errMsg: string) => void;
    response_image: (originalImagePath: any, AIImagePath: any) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    chatMessage: (msg: string) => void;
    send_message: (payload: MessagePayload) => void;
    receive_message: (msg: message) => void;
    users_response: (users: any) => void;
    join_room: (roomId: string, callback?: () => void) => void;
    submit_image: (payload: SubmitImagePayload) => void;

}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}

export type message = {
    text: string,
    name: string,
    time: Date,
    socketId: string,
    roomId?: string,
    userDbId: string,
}

export type RoomUsers = {
    [roomId: string]: string[]
}

export interface IMessage {
    id: string;
    channelId: string;
    userId: string;
    type: "text" | "image" | "file" | "video" | "audio" | "location" | "contact" | "sticker" | "system";
    content: string;
    parentId?: string;
    deletedAt?: string;
    updatedAt?: string;
    createdAt?: string;
}

export type MessagePayload = {
    channel: string,
    message: IMessage
}


export type SubmitImagePayload = {
    channel: string,
    image: any,
    gender: string,
}