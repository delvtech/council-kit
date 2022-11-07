import Link from "next/link";
import { ReactElement } from "react";

export default function Voters(): ReactElement {
  return (
    <div className="flex flex-col items-center max-w-5xl px-4 m-auto mt-16 gap-y-10">
      {/* Page Header */}
      <div className="flex items-center w-full gap-x-2">
        <h1 className="w-full text-3xl text-primary-content">Voters</h1>

        {/* Search Input Box */}
        <input
          type="text"
          placeholder="Search"
          className="w-64 max-w-xs daisy-input-bordered daisy-input"
        />

        {/* Filter Dropdown */}
        <div className="daisy-dropdown">
          <label tabIndex={0} className="m-1 daisy-btn">
            Filter
          </label>
          <ul
            tabIndex={0}
            className="p-2 shadow daisy-dropdown-content daisy-menu rounded-box w-52 bg-base-100"
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
      <table className="w-full daisy-table-zebra daisy-table min-w-fit">
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
