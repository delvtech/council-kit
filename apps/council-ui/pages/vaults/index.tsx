import Link from "next/link";
import { ReactElement } from "react";

export default function Vaults(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-10 px-4">
      {/* Page Header */}
      <div>
        <div className="text-2xl text-primary-content">Vaults</div>
        <div className="text-secondary-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </div>
      </div>

      {/* Vault Table */}
      <table className="daisy-table-zebra daisy-table w-full min-w-fit">
        {/* Table Headers */}
        <thead>
          <tr>
            <th>Address</th>
            <th>Name</th>
            <th>total voting power</th>
            <th>your voting power</th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Locking Vault</td>
            <td>1,000,000</td>
            <td>50,000</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/vaults/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
