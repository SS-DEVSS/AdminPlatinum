import { CategoryAttributesTypes, CategoryResponse } from "@/models/category";

export const ayudaPorfavor: CategoryResponse[] = [
  {
    id: "1",
    imgUrl:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    name: "Balatas",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
    brands: [
      {
        name: "test",
        id: "cda1d346-1e97-4449-924a-44f368b9f8a8",
        logoImgUrl:
          "https://ss-platinum-driveline-api.s3-us-east-1.amazonaws.com/uploads/imgUrls/ChilaquilesIcon1.png",
      },
    ],
    attributes: {
      product: [
        {
          id: "f22fd75b-d328-4a92-878d-6c29d86fcffb",
          name: "1",
          required: true,
          type: CategoryAttributesTypes.DATE,
          order: 0,
          scope: "PRODUCT",
        },
      ],
      variant: [],
    },
    products: [
      {
        id: "f608614e-f5ef-42ec-949d-fd9013e4711b",
        name: "Mazda Engine",
        type: "SINGLE",
        description: "My product descriptionn here",
      },
    ],
  },
  {
    id: "2",
    imgUrl:
      "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
    name: "Clutches",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus rem minus, soluta officia ipsam repudiandae quia rerum voluptatibus ipsum minima",
    brands: [
      {
        id: "1",
        name: "Platinum Driveline",
        logoImgUrl:
          "https://www.platinumdriveline.com/wp-content/uploads/2020/07/NewBoxes-4-2048x1365.jpg",
      },
    ],
    attributes: {
      product: [
        {
          id: "f22fd75b-d328-4a92-878d-6c29d86fcffb",
          name: "1",
          required: true,
          type: CategoryAttributesTypes.DATE,
          order: 0,
          scope: "PRODUCT",
        },
      ],
      variant: [],
    },
    products: [],
  },
];
