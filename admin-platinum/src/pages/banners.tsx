import Layout from "@/components/Layouts/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import S3 from "react-aws-s3-typescript";

const Banners = () => {
  const [image, setImage] = useState(null);

  const handleImageFile = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    const ReactS3Client = new S3({
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      bucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      s3Url: import.meta.env.VITE_AWS_S3_BUCKET_PUBLIC_URL,
      region: import.meta.env.VITE_AWS_REGION,
    });
    ReactS3Client.uploadFile(image!)
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  };

  return (
    <Layout>
      <section className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Banners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Agregar nuevo banner</CardTitle>
            <CardDescription>Ingrese el nuevo banner deseado.</CardDescription>
          </CardHeader>
          <CardContent>
            <input type="file" onChange={handleImageFile} />
            <button onClick={handleUpload}>a</button>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Banners existentes</CardTitle>
            <CardDescription>
              Revisa, elimina y cambia el orden de los banners de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="flex">
              <CardHeader>
                <div className="">
                  <img src="" alt="" className="" />
                </div>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Banners;
