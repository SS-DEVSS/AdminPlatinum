import MyDropzone from "@/components/Dropzone";
import Layout from "@/components/Layouts/Layout";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBanners } from "@/hooks/useBanners";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { Banner } from "@/models/banner";
import { AlertTriangle, GripVertical, XCircle } from "lucide-react";
import { useState } from "react";

const Banners = () => {
  const [image, setImage] = useState<File>({} as File);

  const { loading, banners, addBanner, deleteBanner } = useBanners();
  const { uploadFile, deleteFile } = useS3FileManager();

  const handleUpload = () => {
    if (image) {
      uploadFile(image, (key) => {
        addBanner(key);
        setImage({} as File);
      });
    }
  };

  const handleDeleteBanner = (banner: Banner) => {
    deleteFile(banner.desktopUrl, () => {
      deleteBanner(banner.id);
    });
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
            <MyDropzone className="p-16" file={image} fileSetter={setImage} />
            {image.name && (
              <div className="flex justify-center mt-3 gap-2">
                <Button onClick={() => setImage({} as File)} variant="outline">
                  Cancelar
                </Button>
                <Button disabled={loading} onClick={handleUpload}>
                  Subir Imagen
                </Button>
              </div>
            )}
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
                        className="rounded-lg w-20 h-20 object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="my-auto p-0">
                    {banner.desktopUrl.split("/").pop()}
                  </CardContent>
                  <CardFooter className="block space-y-3 justify-end py-3 ml-auto">
                    <XCircle
                      className="hover:cursor-pointer text-[#707F95]"
                      onClick={() => handleDeleteBanner(banner)}
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
