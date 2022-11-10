import { Container } from "components/base/Container";
import Link from "next/link";
import { ReactElement } from "react";

export default function Vaults(): ReactElement {
  return (
    <Container>
      {/* Page Header */}
      <div>
        <div className="text-5xl text-accent-content">Vaults</div>
        <div className="mt-6 text-lg text-accent-content ">
          Voting Vaults provide the ability to assign voting power to specific
          types of tokens/positions. The result is beautiful — governance users
          can maximize capital efficiency while maintaining the ability to
          delegate or vote when the time comes.
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
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
                <Link
                  href={{
                    pathname: "/vaults/details",
                    query: { address: "0x0000" },
                  }}
                >
                  ▹
                </Link>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}
