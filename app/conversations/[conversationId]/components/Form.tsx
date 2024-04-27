"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
export default function Form() {
  const { conversationId } = useConversation(); //conversationID will extract id from url
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  function onSubmit({ data }: FieldValues) {
    setValue("message", "", { shouldValidate: true }); //to reset message value
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  }

  //Cloudinary Handle Upload function:
  function handleUpload(result: any) {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  }
  return (
    <div className="px-4 py-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload} //onUpload
        uploadPreset="jgcyaog8"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />

        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
}
