import { ReactElement } from "react";

export default function Vaults(): ReactElement {
  return (
    <div className="max-w-5xl m-auto">
      <div className="flex flex-col items-center pl-16 pr-16 mt-16 space-y-8">
        <div className="w-full text-2xl text-left text-white">Vaults</div>
        <div className="w-full text-lg text-left text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris{" "}
        </div>
        <table className="w-full daisy-table daisy-table-zebra min-w-fit">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>total voting power</th>
              <th>your voting power</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
            <tr>
              <th className="underline">0x000...000</th>
              <td>Locking Vault</td>
              <td>1,000,000</td>
              <td>50,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
