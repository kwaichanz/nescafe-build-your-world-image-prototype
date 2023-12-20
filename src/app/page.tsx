"use client";
import { PLACEHOLDER } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/Socket";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [formDatas, setFormDatas] = useState<any>();
  const [base64Image, setBase64Image] = useState<string | ArrayBuffer | null>(
    null
  );

  const [resultImage, setResultImage] = useState<string | ArrayBuffer | null>(
    null
  );

  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    process.env.SOCKET_SERVER!
  );

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("connected to socket server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from socket server");
    });

    socket.on("users_response", (data) => {
      console.log("user response :", data);
    });

    socket.on("response_image", (originalImagePath, AIImagePath) => {
      console.log("response_image AIImagePath", AIImagePath);
      setResultImage(AIImagePath);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const imageUploadHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setImages(filesArray);

      const base64 = convertBase64(filesArray[0]);
      base64.then((res: any) => {
        setBase64Image(res);
      });
    }
  };

  const handleSubmit = async () => {
    console.log("image urls", imageURLs);
    console.log("images", images);

    socket.emit("submit_image", {
      channel: "1",
      image: base64Image,
      gender: selectedGender,
    });
  };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: any = [];
    images.forEach((image: any) =>
      newImageUrls.push(URL.createObjectURL(image))
    );
    setImageURLs(newImageUrls);
    const fileData = new FormData();
    images.forEach((file: any) => fileData.append("images", file));
    console.log("fileData", fileData);

    // setFormDatas(fileData);
  }, [images]);

  useEffect(() => {
    socket.emit("join_room", "1");
  }, []);
  return (
    <main className="flex min-h-screen text-white flex-col items-center justify-center p-24 bg-foreground">
      <div className="bg-gray-800 p-4 text-center flex flex-col gap-2 max-w-md w-full">
        <h1 className="text-2xl font-bold ">
          Status:{" "}
          {isConnected ? (
            <span className="text-green-400">Connected</span>
          ) : (
            <span className="text-red-500">Not connected</span>
          )}
        </h1>
        <div className="p-2 text-center flex flex- items-center">
          <Image
            src={imageURLs[0] || PLACEHOLDER.src}
            width={200}
            height={200}
            alt="preview image"
          />
          <Image
            src={"data:image/jpeg;base64, " + resultImage || PLACEHOLDER.src}
            width={200}
            height={200}
            alt="result image"
          />
        </div>
        <RadioGroup
          defaultValue="male"
          onValueChange={(value: "male" | "female") => setSelectedGender(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>{" "}
        <Input
          type="file"
          onChange={imageUploadHandle}
          placeholder="text-input"
        />
        <Button onClick={() => handleSubmit()}>Click me</Button>
      </div>
    </main>
  );
}
