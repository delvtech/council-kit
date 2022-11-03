import Link from "next/link";
import { ReactElement } from "react";

export default function Voters(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-6 px-16">
      <div className="flex w-full items-center gap-x-2">
        <h1 className="w-full text-3xl text-white">Voters</h1>
        <input
          type="text"
          placeholder="Search"
          className="daisy-input-bordered daisy-input w-64 max-w-xs"
        />
        <div className="daisy-dropdown">
          <label tabIndex={0} className="daisy-btn m-1">
            Filter
          </label>
          <ul
            tabIndex={0}
            className="daisy-dropdown-content daisy-menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      <table className="daisy-table-zebra daisy-table w-full min-w-fit">
        <thead>
          <tr>
            <th>Voter</th>
            <th>GSC Status</th>
            <th>Voting Power</th>
            <th>% of TVP</th>
            <th>participation grade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Ineligible</td>
            <td>50,000</td>
            <td>1.02%</td>
            <td>90%</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/voters/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Ineligible</td>
            <td>50,000</td>
            <td>1.02%</td>
            <td>90%</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/voters/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Ineligible</td>
            <td>50,000</td>
            <td>1.02%</td>
            <td>90%</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/voters/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Ineligible</td>
            <td>50,000</td>
            <td>1.02%</td>
            <td>90%</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/voters/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th className="underline">0x000...000</th>
            <td>Ineligible</td>
            <td>50,000</td>
            <td>1.02%</td>
            <td>90%</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href="/voters/0x0000000">▹</Link>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
