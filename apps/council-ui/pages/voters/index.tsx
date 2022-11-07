import Link from "next/link";
import { ReactElement } from "react";

export default function Voters(): ReactElement {
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-10 px-4">
      {/* Page Header */}
      <div className="flex w-full items-center gap-x-2">
        <h1 className="w-full text-3xl text-primary-content">Voters</h1>

        {/* Search Input Box */}
        <input
          type="text"
          placeholder="Search"
          className="daisy-input-bordered daisy-input w-64 max-w-xs"
        />

        {/* Filter Dropdown */}
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

      {/* Voters Table */}
      <table className="daisy-table-zebra daisy-table w-full min-w-fit">
        {/* Table Header */}
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

        {/* Table Body */}
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
