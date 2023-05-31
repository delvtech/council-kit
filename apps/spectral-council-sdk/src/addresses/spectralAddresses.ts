import mumbaiAddressList from "src/addresses/SpectralMumbaiAddressList.json";
// import { provider } from "src/provider";

type Addresses = typeof mumbaiAddressList.addresses;

export async function getSpectralAddress(): Promise<Addresses> {
  return mumbaiAddressList.addresses;
}
