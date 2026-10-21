import {uploadMenuFiles} from "@/app/actions";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form action={uploadMenuFiles} className="flex flex-col gap-4 max-w-sm">
        {/*
        accept: Restricts the types of files the user can pick
        multiple: Add this attribute if you want to allow picking multiple files
      */}
        <input
            type="file"
            name="files"
            accept="image/png, image/jpeg"
            multiple
            required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload File
        </button>
      </form>
    </div>
  );
}
