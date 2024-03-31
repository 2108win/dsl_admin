export type ProductData = {
  id: string;
  IdEmployee: string;
  ProductName: string;
  image_url: string[];
  Brand: string;
  Model: string;
  Power: string;
  Adapter: string;
  TimeIsBattery: string;
  TimeIsUse: string;
  ManySpeaker: string;
  ManyBass: string;
  Treble: string;
  ConnectWireless: string;
  ConnectMicroWireless: string;
  ConnectOther: string;
  PortWiredMicro: string;
  Length: number;
  Width: number;
  Height: number;
  Weight: number;
  Material: string;
  Color: string;
  Frequency: string;
  Price: number;
  Status: number;
};

export const productData: ProductData[] = [
  {
    id: "1",
    IdEmployee: "1",
    ProductName: "Loa Xách Tay",
    image_url: ["url-image-1.jpg", "url-image-2.ipg"],
    Brand: "NANOMAX",
    Model: "K-01",
    Power: "120W",
    Adapter: "DC 9v/1.5A",
    TimeIsBattery: "2 ~ 5 tiếng",
    TimeIsUse: "2 ~ 4 tiếng",
    ManySpeaker: "2 loa 2 đường tiếng",
    ManyBass: "20cm",
    Treble: "Họng còi",
    ConnectWireless: "Bluetooth 5.0",
    ConnectMicroWireless: "Bank tần VHF tiết kiệm pin",
    ConnectOther: "Phát nhạc Mp3 qua USB và thẻ nhớ",
    PortWiredMicro: "Jack 6.5",
    Length: 40,
    Width: 20,
    Height: 28,
    Weight: 13,
    Material: "Gỗ bọc da giả",
    Color: "Đen - Trắng - Da",
    Frequency: "50Hz - 20kHz",
    Price: 5000000,
    Status: 1,
  },
];

export default productData;

export type ImageData = {
  id: string;
  idEmployee: string;
  content: string;
  images: { Color: string; images: string[] };
  claims: string[];
  concurrencyStamp: string | null;
};

export const ImageData = [
  {
    claims: [],
    concurrencyStamp: null,
    content: "test 2",
    id: "df390785-d3fb-4467-80f5-d848b03cf542",
    idEmployee: "5fd35a24-6b23-455b-9798-555006eff95d",
    images: { Color: "Đen", images: ["sdasdsadsad", "sdasdsadsad"] },
  },
];
