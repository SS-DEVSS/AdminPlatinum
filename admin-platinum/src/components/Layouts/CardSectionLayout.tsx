import { ReactNode } from "react";

type CardSectionLayoutProps = {
  children: ReactNode;
};

const CardSectionLayout = ({ children }: CardSectionLayoutProps) => {
  return (
    <main className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
      {/* {categories.map((category) => (
      <Link href={`/admin/Categories/category/${category.title}`}>
        <Card key={category.id} className="w-full">
          <Image
            width={600}
            height={100}
            src={`${category.image}`}
            alt="name"
            className="max-h-[300px] object-cover rounded-t-lg"
          />
          <CardContent>
            <div className="flex justify-between items-center">
              <CardTitle className="mt-6 mb-4">
                {category.title}
              </CardTitle>
            </div>
            <CardDescription className="leading-7">
              {category.description}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    ))} */}
    </main>
  );
};

export default CardSectionLayout;
