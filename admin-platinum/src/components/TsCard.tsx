import { TechnicalSheet } from "@/models/technicalSheet";

type TsCardProps = {
  ts: TechnicalSheet;
};

const TsCard = ({ ts }: TsCardProps) => {
  return (
    <div className="bg-naranja w-full flex gap-4 rounded-2xl p-3">
      {/* <img src={ts.url} alt={`imagen ${ts.title}`} /> */}
      <div className="h-40 basis-1/3 rounded-xl bg-black">.</div>
      <section className="basis-2/3 text-white">
        <h2 className="font-semibold text-xl">{ts.title}</h2>
        <p className="mt-2">{ts.description}</p>
      </section>
    </div>
  );
};

export default TsCard;
