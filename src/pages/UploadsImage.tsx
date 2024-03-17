import { useState } from "react";
import ToastifyFunction from "../Utils/Toastify";
import axios from "axios";
import "../Css/Uploads.css";

const UploadsImage = () => {
  const [files, setFiles] = useState<File[] | null>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files;
    if (!fileInput) return;
    const filesArray = Array.from(fileInput);
    setFiles((prevFiles) =>
      prevFiles === null ? filesArray : [...prevFiles, ...filesArray]
    );
  };

  const handelSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const presset = "bg_perfil";
    const name = "dtkskpitc";
    if (files === null || files.length === 0) {
      ToastifyFunction("No file selected", false);
      return;
    }
    const api = `https://api.cloudinary.com/v1_1/${name}/image/upload`;
    const uploadsImages = await Promise.all(
      files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", presset);
        try {
          const response = await axios.post(api, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              let progress = 0;
              if (progressEvent.total !== undefined) {
                progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              }
              setUploadProgress(
                ((index + 1) / files.length) * 100 + progress / files.length
              );
            },
          });
          const responseData = response.data ? response.data.secure_url : null;
          return responseData;
        } catch (error) {
          ToastifyFunction("An error occurred", false);
          return;
        }
      })
    );
    if (!uploadsImages.includes(undefined)) {
      setLinks(uploadsImages);
    }
    setFiles(null);
    setUploadProgress(0);
    ToastifyFunction("The upload was successful", true);
  };

  const handleClickCpy = (link: string) => {
    navigator.clipboard.writeText(link);
    ToastifyFunction("Link copied to clipboard", true);
  };

  const handleClickAllCpy = () => {
    const linksCpy = links.join(",");
    navigator.clipboard.writeText(linksCpy);
    ToastifyFunction("Link copied to clipboard", true);
  };

  const handleDelete = (index: number): void => {
    if (files === null) return;
    const newFiles: File[] = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  return (
    <section className="h-screen sm:p-3 p-1 container_upload scrollbar">
      {links.length > 0 && (
        <div
          id="output"
          className="container_url flex items-center rounded-lg bg-white pb-3 pt-2 scrollbar"
        >
          <h2 className="text-xl font-semibold mb-2">List of URLs</h2>

          {links.map((url, index) => (
            <div key={index} className="container_url-links">
              <button
                onClick={() => handleClickCpy(url)}
                className="copy text-white bg-indigo-600"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
              <p className="urlimg text-blue-500 font-semibold text-sm sm:text-base">
                {url.substring(0, 47) + "..."}
              </p>
            </div>
          ))}
          {links.length > 1 && (
            <div className=" w-full p-2 flex justify-evenly">
              <button
                className=" rounded-full bg-blue-600 px-5 py-2 font-semibold text-white cursor-pointer"
                onClick={() => handleClickAllCpy()}
              >
                Copy all
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className={`mx-auto sm:w-full w-11/12 ${
          links.length > 1 ? "max-w-[450px]" : "max-w-[550px]"
        } bg-white rounded-md`}
      >
        <form className="py-3 px-9" onSubmit={handelSubmit}>
          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
            Upload Images
          </label>

          <div className="mb-8">
            <input
              type="file"
              name="file"
              id="file"
              className="sr-only"
              multiple
              accept="image/*"
              onChange={handleChange}
            />
            <label
              htmlFor="file"
              className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
            >
              <div>
                <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                  Drop files here
                </span>
                <span className="mb-2 block text-base font-medium text-[#6B7280]">
                  Or
                </span>
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  Browse
                </span>
              </div>
            </label>
          </div>
          {uploadProgress > 1 && (
            <div className="relative m-auto mt-2 h-[6px] w-11/12 rounded-lg bg-[#E2E5EF]">
              <div
                className="absolute left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
                style={{ width: `${uploadProgress}` }}
              />
            </div>
          )}
          {files !== null && (
            <ul className="p-1 m-2 overflow-y-auto max-h-[30vh] w-11/12 scrollbar">
              {files.length > 0 &&
                files.map((file, i) => (
                  <li className="rounded-md bg-[#F5F7FB] py-2 px-8 m-3" key={i}>
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-1 text-base font-medium text-[#07074D]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="text-[#07074D]"
                        onClick={() => handleDelete(i)}
                      >
                        <svg
                          width={10}
                          height={10}
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}

          <div>
            <button className="hover:shadow-form w-11/12 rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Send File
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadsImage;
