'use client'
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imagesList, setImagesList] = useState([]);
  const { toast } = useToast();
  axios.defaults.baseURL = "https://pet-clam-selected.ngrok-free.app/"
  const updateImagesList = async () => {
    const { data } = await axios.get("/media/imagesList", {
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '54235'
      }
    });
    console.log(data);
    
    setImagesList(data['images']);
  }
  
  const downloadImage = async (imgid: number) => {
    await axios.get(`/media/download/` + imgid)
  } 
  useEffect(() => {
    handleUpload();
  }, [selectedFile])

  useEffect(() => {
    updateImagesList();
  }, [])
  const handleUpload = async () => {
    setUploading(true);
    try {
      console.log(selectedFile);

      if (!selectedFile) {
        setUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { data } = await axios.post("/media/upload", formData);
      console.log(data);
      toast({
        title: "Camoenc",
        description: "Image uplaoded successfully"
      });
      updateImagesList();
      console.log(imagesList);

    } catch (error: any) {
      console.log(error.response?.data);

    }
    setUploading(false);
  }
  return (
    <main className="flex flex-col items-center">
      <div className="w-full p-5">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">My Files</h1>
          <label>
            <input
              type="file"
              hidden
              onChange={({ target }) => {
                if (target.files) {
                  console.log(target.files);

                  const file = target.files[0];
                  console.log(file);

                  //setSelectedImage(URL.createObjectURL(file));
                  setSelectedFile(file);
                  console.log(selectedFile);

                  //handleUpload();
                }
              }} />
            {uploading ? (
              <span className="bg-black p-3 text-white rounded-md cursor-pointer">
                Uploading
              </span>
            ) : (
              <span className="bg-black p-3 text-white rounded-md cursor-pointer">
                Upload
              </span>
            )}


          </label>
        </div>
        {imagesList.length == 0 ? (
          <div className="flex flex-col items-center ">
            No files here. Click on Upload to upload a file.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imagesList.map((image, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{image}</TableCell>
                  <TableCell><a href={"https://pet-clam-selected.ngrok-free.app/media/download/" + index} download> Download </a></TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        )}


      </div>

    </main>
  );
}
