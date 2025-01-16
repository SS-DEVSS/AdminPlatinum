import Layout from "@/components/Layouts/Layout";
import NoData from "@/components/NoData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBanners } from "@/hooks/useBanners";
import { Banner } from "@/models/banner";
import { AlertTriangle, GripVertical, XCircle } from "lucide-react";
import { useState } from "react";
import S3 from "react-aws-s3-typescript";

const Banners = () => {
  const [image, setImage] = useState({
    name: "",
  });

  const { banners, addBanner, deleteBanner } = useBanners();

  const handleImageFile = (e: any) => {
    setImage(e.target.files[0]);
  };

  const cleanPath = (path: Banner["desktopUrl"]) => {
    return path.slice(66);
  };

  const handleUpload = () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const ReactS3Client = new S3({
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      bucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      region: import.meta.env.VITE_AWS_REGION,
    });

    const cleanedFileName = image.name
      .replace(/\s+/g, "")
      .replace(/\.[^/.]+$/, "");
    const filePath = `uploads/images/${cleanedFileName}`;

    ReactS3Client.uploadFile(image, filePath)
      .then((data) => addBanner(data.key))
      .catch((e) => console.error(e));
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
          <CardContent className="flex flex-col gap-4">
            {banners.length && banners.length !== 0 ? (
              banners.map((banner: Banner) => (
                <Card
                  key={banner.id}
                  className="bg-[#EEEEEE] flex items-center"
                >
                  <CardHeader className="p-3 px-4">
                    <div className="border rounded-lg">
                      <img
                        src={banner.desktopUrl}
                        alt={banner.desktopUrl}
                        className="rounded-lg w-20"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="my-auto p-0">
                    {cleanPath(banner.desktopUrl)}
                  </CardContent>
                  <CardFooter className="block space-y-3 justify-end py-0 ml-auto">
                    <XCircle
                      className="hover:cursor-pointer text-[#707F95]"
                      onClick={() => deleteBanner(banner.id)}
                    />
                    <GripVertical className="hover:cursor-pointer text-[#707F95]" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <NoData>
                <AlertTriangle className="text-[#4E5154]" />
                <p className="text-[#4E5154]">No se ha creado ningún banner</p>
                <p className="text-[#94A3B8] font-semibold text-sm">
                  Agrega uno en la parte posterior
                </p>
              </NoData>
            )}
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Banners;
